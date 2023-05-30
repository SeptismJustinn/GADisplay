from server import db

class Users(db.Model):
    __tablename__='Users'

    id = db.Column(db.Uuid, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255))
    hash = db.Column(db.String(255))
    role = db.Column(db.ForeignKey('Roles.role'))

    def __init__(self, name, email, hash, role):
        self.name = name
        self.email = email
        self.hash = hash
        self.role = role
      
    def __repr__(self):
        return f'<User "{self.name}">'


    