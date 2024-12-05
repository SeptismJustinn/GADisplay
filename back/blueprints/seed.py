import os
from uuid import uuid4
from flask import Blueprint, jsonify, request
from argon2 import PasswordHasher
from datetime import datetime, timedelta

from models.db import db
from models.roles import Roles
from models.rooms import Rooms
from models.course_types import CourseTypes
from models.days_schedules import DaysSchedules
from models.users import Users
from models.adhocs import Adhocs

seed_bp = Blueprint('seed_bp', __name__, url_prefix='/seed')


@seed_bp.route("/", methods=['PATCH'])
def seed_database():
    seeded_tables = []
    seed_functions_no_auth = [seed_routes, seed_rooms, seed_types, seed_days]
    seed_functions_auth = [seed_users]
    seed_auth = request.json.get('password', None)
    for seed_fn in seed_functions_no_auth:
        try:
            outcome = seed_fn()
            if outcome:
                seeded_tables.append(seed_fn.__name__.split("_")[1])
        except Exception as e:
            print(e)
            return jsonify({'status': 'error', 'message': f'error seeding {seed_fn.__name__.split("_")[1]}'}), 400
    for seed_fn in seed_functions_auth:
        try:
            outcome = seed_fn(seed_auth)
            if outcome:
                seeded_tables.append(seed_fn.__name__.split("_")[1])
        except Exception as e:
            print(e)
            return jsonify({'status': 'error', 'message': f'error seeding {seed_fn.__name__.split("_")[1]}'}), 400
    return jsonify({'status': 'ok', 'message': f'{", ".join(seeded_tables)} seeded'})

# @seed_bp.route('/roles')
def seed_routes():
    existing_roles = [item.role for item in Roles.query.all()]
    new_roles = list()
    if 'Registered' not in existing_roles:
        registered = Roles('Registered')
        new_roles.append(registered)
    if 'User' not in existing_roles:
        user = Roles('User')
        new_roles.append(user)
    if 'Admin' not in existing_roles:
        admin = Roles('Admin')
        new_roles.append(admin)
    if len(new_roles) == 0:
        # return jsonify({'status': 'ok', 'message': 'roles already seeded'})
        return False
    else:
        db.session.add_all(new_roles)
        db.session.commit()
        # return jsonify({'status': 'ok', 'message': 'roles seeded'})
        return True


# @seed_bp.route('/rooms')
def seed_rooms():
    db.session.query(Rooms).delete()
    for i in range(1,7):
        new_room = Rooms(i)
        db.session.add(new_room)
    db.session.commit()
    # return jsonify({'status': 'ok', 'message': 'rooms seeded'})
    return True

@seed_bp.route('/types')
def seed_types():
    db.session.query(CourseTypes).delete()
    db.session.add_all([CourseTypes('FT'), CourseTypes('Flex'), CourseTypes('PT')])
    db.session.commit()
    db.session.commit()
    # return jsonify({'status': 'ok', 'message': 'course types seeded'})
    return True

# @seed_bp.route('/days')
def seed_days():
    db.session.query(DaysSchedules).delete()
    # DaysSchedules(mon,tue,wed,thu,fri,sato,sate,sun)
    # Add MoTuWeTh
    mtwt = DaysSchedules(True, True, True, True)

    # Add TuWeThSA
    twts = DaysSchedules(False, True, True, True, False, True, True)

    # Add MoTuWeThFrSA
    mtwtfs = DaysSchedules(True, True, True, True, True, True, True)

    # Add MoTu
    mt = DaysSchedules(True,True)

    # Add WeTh
    wt = DaysSchedules(False,False,True,True)

    # Add Sat_odd
    so = DaysSchedules(False,False,False,False,False,True)

    # Add Sat_even
    se = DaysSchedules(False,False,False,False,False,False,True)

    db.session.add_all([mtwt, twts, mtwtfs, mt, wt, so, se])
    db.session.commit()
    # return jsonify({'status': 'ok', 'message': 'common schedules seeded'})
    return True

# @seed_bp.route("/users", methods=['PATCH'])
def seed_users(server_auth):
    """
    Requires 'password' to be sent in request body. 'password' should match SEED_PW in env.
    Utilizing PATCH method to obscure access to route functions but ultimately this route should be benign, requiring
    DB Administrator to configure access rights for the seeded users.
    """
    # server_auth = request.json.get('password', None)
    if server_auth is not None and server_auth == os.environ.get('SEED_PW', None):
        ph = PasswordHasher()
        pw = ph.hash('examples')
        users_to_add = []
        # Check if users exist before seeding, just in case this function might screw over a future Stan Dinguere
        reg_user = Users.query.filter_by(email="newbee@generalassemb.ly").one_or_none()
        if reg_user is None:
            reg_user = Users("New Guy", "newbee@generalassemb.ly", pw)
            users_to_add.append(reg_user)
        norm_user = Users.query.filter_by(email="stan.dinguere@generalassemb.ly").one_or_none()
        if norm_user is None:
            norm_user = Users("Stan Dinguere", "stan.dinguere@generalassemb.ly", pw)
            users_to_add.append(norm_user)
        admin_user = Users.query.filter_by(email="g.od@generalassemb.ly").one_or_none()
        if admin_user is None:
            admin_user = Users("Grace Odette", "g.od@generalassemb.ly", pw)
            users_to_add.append(admin_user)
        former_staff = Users.query.filter_by(email="former.staff@generalassemb.ly").one_or_none()
        if former_staff is None:
            former_staff = Users("Former Staff", "former.staff@generalassemb.ly", uuid4(), "Admin")
            users_to_add.append(former_staff)
        # Modify perms DB-side
        if len(users_to_add) > 0:
            db.session.add_all(users_to_add)
            db.session.commit()
        # return jsonify({'status': 'ok', 'message': 'users seeded'})
        return True
    else:
        # return jsonify({'status': 'error', 'message': 'error seeding users'}), 400
        return False

@seed_bp.route("/adhocs")
def seed_adhocs():
    try:
        events = ["Explore the UX Design Process", "Code with HTML, CSS & Javascript", "Career Coaches Event",
                  "Intro to Software Engineering", "Intro to User Experience Design", "Intro to Data Science",
                  "In the vast cosmos, distant stars shimmer with cosmic secrets, whispering tales of celestial wonders"]
        now = datetime.utcnow().replace(second=0, microsecond=0)
        hour = timedelta(minutes=1)
        former_staff = Users.query.filter_by(email="former.staff@generalassemb.ly").first()
        adhocs_list = []
        for eve in events:
            adhoc = Adhocs(eve, now, now + hour, 2, (eve + eve)[:30], former_staff.id)
            adhocs_list.append(adhoc)
            now = now + hour
        db.session.add_all(adhocs_list)
        db.session.commit()
        return jsonify({'status': 'ok', 'message': 'adhocs seeded'})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': 'error seeding adhocs'}), 400
