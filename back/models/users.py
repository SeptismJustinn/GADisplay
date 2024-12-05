from sqlalchemy import text
from sqlalchemy.dialects.postgresql import UUID
from models.db import db


class Users(db.Model):
    __tablename__ = 'Users'

    id = db.Column(UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.ForeignKey('Roles.role'), default='Registered')
    adhocs = db.relationship('Adhocs', backref='adhocs', lazy=True)

    def __init__(self, name, email, hash, role='Registered'):
        self.name = name
        self.email = email
        self.hash = hash
        self.role = role

    def __repr__(self):
        return f'<User "{self.name}">'
