import os
import sys

from flask import Flask, jsonify

from models.db import db
from models.users import Users
from models.logins import Logins
from schemas.mm import mm
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Blueprints for specialized endpoints
from blueprints.seed import seed_bp
from blueprints.auth import auth_bp
from blueprints.users import users_bp
from blueprints.cohorts import cohorts_bp
from blueprints.adhocs import adhocs_bp
from blueprints.display import display_bp

# Load .env
from dotenv import load_dotenv
load_dotenv()

# Setup Flask app
app = Flask(__name__)
db_url = os.environ.get('SQLALCHEMY_DATABASE_URI', None)
jwt_secret_key = os.environ.get('JWT_SECRET_KEY', None)
if db_url is None or jwt_secret_key is None:
    print('No DB Url or Secret Key(s)')
    sys.exit()

app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['JWT_SECRET_KEY'] = jwt_secret_key
# Access token expiry in hours (60 s * 60 minutes * x=2 hours)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 60 * 60 * 2
# Refresh token expiry in hours (60 s * 60 minutes * x=24 hours)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 60 * 60 * 24

# Initialize other app dependent instances
db.init_app(app)
mm.init_app(app)
jwt = JWTManager(app)
CORS(app)

with app.app_context():
    db.create_all()


# Setup automatic user loading via JWT
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


@jwt.user_lookup_loader
def user_lookup_callback(jwt_header, jwt_data):
    identity = jwt_data["sub"]  # "sub" refers to identity in create_token(identity, args*)
    return Users.query.filter_by(id=identity).first()


# Utilizing opposite logic to whitelist tokens based on Logins records in database.
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_data):
    jti = jwt_data['jti']
    login = Logins.query.filter_by(jti=jti).one_or_none()
    return login is None  # If True returned, token is 'revoked'


@jwt.revoked_token_loader
def revoked_token(*args):
    return jsonify(error='Invalid Token'), 401


@jwt.expired_token_loader
def expired_token_callback(*args):
    return jsonify(error='Token expired.'), 401


app.register_blueprint(seed_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)
app.register_blueprint(cohorts_bp)
app.register_blueprint(adhocs_bp)
app.register_blueprint(display_bp)


@app.route("/")
def get_data():
    return 'Server running!'
