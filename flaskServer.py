from flask import Flask, jsonify, abort, make_response, request, g
from flask_cors import CORS
from pymongo import MongoClient, DeleteMany, DeleteOne
from passlib.apps import custom_app_context as pwd_context
from flask_httpauth import HTTPBasicAuth
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'OVSWRzBeL4PFgs6smfEWl7btuyXACZR7aByLMwwu9bwXh4BYlrBW'
CORS(app)
auth = HTTPBasicAuth()

client = MongoClient('localhost', 27017)
col = client['mydb']['tasks']
users = client['mydb']['users']

class User():
    def __init__(self, username, password_hash = None, _id = None):
        self.username = username

        if password_hash == None or _id == None:
            cursor = users.find( {'username': username} )
            for rec in cursor:
                self.password_hash = rec['password_hash']
                self._id = rec['_id']
                break
            return

        self.password_hash = password_hash
        self._id = _id

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        if not self.password_hash:
            return False
        return pwd_context.verify(password, self.password_hash)

    def add_to_db(self):
        dbObj = {
            'username': self.username,
            'password_hash': self.password_hash
        }

        users.insert_one(dbObj)

    def generate_auth_token(self, expiration = 7200):
        s = Serializer(app.config['SECRET_KEY'], expires_in = expiration)
        return s.dumps({'id': str(self._id)})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None # valid token, but expired
        except BadSignature:
            return None # invalid token

        cursor = users.find()
        for rec in cursor:
            print(rec)
            print(data['id'])
            if str(rec['_id']) == data['id']:
                user = User(rec['username'], rec['password_hash'], rec['_id'])

        if user == None:
            return None

        return user

@auth.verify_password
def verify_password(username_token, password):
    # try auth by token
    user = User.verify_auth_token(username_token)
    if not user:
        # try auth with username/password
        user = User(username_token)
        if not user.verify_password(password):
            return False
    g.user = user
    return True

@app.route('/db')
def get_db_all():
    dbResult = read_db()
    return jsonify({'result': dbResult})

@app.route('/db/delete/<int:db_id>', methods=['DELETE'])
def db_delete(db_id):
    result = col.delete_many({'id': db_id})
    dbResult = read_db()
    return jsonify({'result': dbResult})

@app.route('/db/add', methods=['POST'])
def db_add():
    if not request.json or not 'title' in request.json:
        abort(400)

    dbResult = read_db()

    if not dbResult:
        id = 1
    else:
        id = int(dbResult[-1]['id']) + 1

    dbObj = {
        'id': id,
        'title': request.json['title'],
        'description': request.json.get('description', '')
    }

    result = col.insert_one(dbObj)
    dbResult = read_db()
    return jsonify({'result': dbResult})

def read_db():
    dbResult = []
    cursor = col.find()

    for rec in cursor:
        dbObj = {
            'id': rec['id'],
            'title': rec['title'],
            'description': rec['description']
        }

        dbResult.append(dbObj)

    return dbResult

@app.route('/users/add', methods=['POST'])
def new_user():
    username = request.json.get('username')
    password = request.json.get('password')
    if username is None or password is None:
        abort(400) #missing info
    cursor = users.find()
    for rec in cursor:
        if rec['username'] == username:
            abort(400) # existing user

    user = User(username)
    user.hash_password(password)
    user.add_to_db()
    return jsonify({'username': user.username})

@app.route('/users/<string:username>', methods=['GET'])
def get_user(username):
    username = username
    user = User(username)
    return jsonify(user.username + " " + user.password_hash)

@app.route('/api/resource')
@auth.login_required
def get_resource():
    return jsonify({'data': 'Hello %s' % g.user.username})

@app.route('/api/token')
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token()
    return jsonify( {'token': token.decode('ascii') })


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    app.run(debug=True)
