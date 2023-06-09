from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
# Middleware
from middleware.requests import check_request, check_user, check_admin
# Models
from models.db import db
from models.adhocs import Adhocs
from models.users import Users
# Schemas
from schemas.adhocs import AdhocsSchema, AdhocsSchemaWUser

adhocs_bp = Blueprint('adhocs_bp', __name__, url_prefix="/adhocs")


@adhocs_bp.route("/")
@jwt_required()
def get_adhoc():
    adhocs = AdhocsSchema(many=True).dump(
        Adhocs.query.filter_by(active=True).order_by(
            Adhocs.starts, Adhocs.room
        ).all()
    )
    return jsonify(adhocs)


@adhocs_bp.route("/full")
@jwt_required()
def get_adhoc_with_user():
    adhocs = AdhocsSchemaWUser(many=True).dump(
        db.session.query(Adhocs).join(Users, Adhocs.id == Users.id).filter(Adhocs.active).order_by(
            Adhocs.starts, Adhocs.room
        ).all()
    )
    return jsonify(adhocs)


@adhocs_bp.route("/add", methods=['PUT'])
@check_request
@jwt_required()
@check_user
def add_adhoc():
    data = request.get_json()
    user = get_jwt()['sub']
    data['id'] = user
    try:
        loaded_data = AdhocsSchema().load(data)
        db.session.add(Adhocs(**loaded_data))
        db.session.commit()
        return jsonify({'status': 'ok', 'message': 'adhoc added'})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': 'Error adding adhoc'}), 400


@adhocs_bp.route("/delete", methods=['DELETE'])
@check_request
@jwt_required()
def delete_adhoc():
    data = request.get_json()
    try:
        db.session.query(Adhocs).filter_by(num=data['num']).delete()
        db.session.commit()
        return jsonify({'status': 'ok', 'message': 'adhoc deleted'})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': 'Error deleting adhoc'}), 400
