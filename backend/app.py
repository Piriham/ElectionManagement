from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
import os
import MySQLdb

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# Load environment variables from .env file
load_dotenv()

# Debug: Print environment variables
print("DB_HOST:", os.getenv('DB_HOST'))
print("DB_USER:", os.getenv('DB_USER'))
print("DB_PASSWORD:", os.getenv('DB_PASSWORD'))
print("DB_NAME:", os.getenv('DB_NAME'))
print("DB_PORT:", os.getenv('DB_PORT'))

# MySQL configurations using environment variables
app.config['MYSQL_HOST'] = os.getenv('DB_HOST')
app.config['MYSQL_USER'] = os.getenv('DB_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('DB_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('DB_NAME')
app.config['MYSQL_PORT'] = int(os.getenv('DB_PORT'))

mysql = MySQL(app)

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    aadhar_id = data['aadharID']
    password = data['password']
    role = data['role']
    party_name = data.get('party', None)
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    cursor = mysql.connection.cursor()
    try:
        # Check if user already exists
        cursor.execute("SELECT * FROM login WHERE aadhar_id = %s", (aadhar_id,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify(message='User already exists'), 400

        # Insert into login table
        cursor.execute("INSERT INTO login (aadhar_id, role, password, party_name) VALUES (%s, %s, %s, %s)", (aadhar_id, role, hashed_password, party_name))
        
        mysql.connection.commit()
        return jsonify(message='User registered successfully'), 201
    except Exception as e:
        mysql.connection.rollback()
        return jsonify(message='Error registering user', error=str(e)), 400
    finally:
        cursor.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    aadhar_id = data['aadharID']
    password = data['password']

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM login WHERE aadhar_id = %s", (aadhar_id,))  # Add a trailing comma to make it a tuple
    user = cursor.fetchone()
    cursor.close()

    if user and bcrypt.check_password_hash(user[1], password):  # Assuming password is the 2nd column
        response_data = {
            'aadhar_id': user[0],
            'role': user[2],
            'party_name': user[3]
        }        
        return jsonify(response_data), 200
    else:
        return jsonify(message='Invalid credentials'), 400

# def insert_user(data, hashed_password):
#     cursor = mysql.connection.cursor()
#     cursor.execute(
#         "INSERT INTO login (aadhar_id, password, role, party_name) VALUES (%s, %s, %s, %s)",
#         (data.aadhar_id, hashed_password, data.role, data.party_name)
#     )
#     mysql.connection.commit()
#     cursor.close()


@app.route('/getConstituencyInfo', methods=['GET'])
def get_constituency_info():
    voter_id = request.args.get('voterId')
    cursor = mysql.connection.cursor()
    cursor.callproc('getconsinfo', [voter_id])
    results = cursor.fetchall()
    cursor.close()

    constituency_info = []
    for row in results:
        constituency_info.append({
            'constituencyName': row[0],
            'state': row[1],
            'voterCount': row[2],
            'candidateName': row[3],
            'candidateAge': row[4],
            'partyName': row[5],
            'partySymbol': row[6]
        })

    return jsonify(constituency_info)

@app.route('/getConstituencyDetails', methods=['GET'])
def get_constituency_details():
    cursor = mysql.connection.cursor()
    cursor.callproc('getconsdets')
    results = cursor.fetchall()
    cursor.close()

    constituency_details = []
    for row in results:
        constituency_details.append({
            'constituencyName': row[0],
            'maleCount': row[1],
            'femaleCount': row[2],
            'pollBoothCount': row[3]
        })

    return jsonify(constituency_details)

@app.route('/getVoterDetails', methods=['GET'])
def get_voter_details():
    cursor = mysql.connection.cursor()
    cursor.callproc('getvoterdets')
    results = cursor.fetchall()
    cursor.close()

    voter_details = []
    for row in results:
        voter_details.append({
            'aadharId': row[0],
            'firstName': row[1],
            'lastName': row[2],
            'middleName': row[3],
            'gender': row[4],
            'dob': row[5],
            'age': row[6],
            'state': row[7],
            'phoneNo': row[8],
            'constituencyName': row[9],
            'pollBoothId': row[10],
            'voterId': row[11]
        })

    return jsonify(voter_details)

@app.route('/getCandidateDetails', methods=['GET'])
def get_candidate_details():
    cursor = mysql.connection.cursor()
    cursor.callproc('getcanddets')
    results = cursor.fetchall()
    cursor.close()

    candidate_details = []
    for row in results:
        candidate_details.append({
            'aadharId': row[0],
            'firstName': row[1],
            'lastName': row[2],
            'middleName': row[3],
            'gender': row[4],
            'dob': row[5],
            'age': row[6],
            'phoneNo': row[7],
            'consFight': row[8],
            'candidateId': row[9],
            'partyRep': row[10]
        })

    return jsonify(candidate_details)

@app.route('/getPartyDetails', methods=['GET'])
def get_party_details():
    cursor = mysql.connection.cursor()
    cursor.callproc('getpartydets')
    results = cursor.fetchall()
    cursor.close()

    party_details = []
    for row in results:
        party_details.append({
            'partyName': row[0],
            'partySymbol': row[1],
            'president': row[2],
            'partyFunds': row[3],
            'headquarters': row[4],
            'seatsWon': row[5],
            'partyMemberCount': row[6]
        })

    return jsonify(party_details)

@app.route('/getOfficialDetails', methods=['GET'])
def get_official_details():
    cursor = mysql.connection.cursor()
    cursor.callproc('getofficialdets')
    results = cursor.fetchall()
    cursor.close()

    official_details = []
    for row in results:
        official_details.append({
            'aadharId': row[0],
            'firstName': row[1],
            'lastName': row[2],
            'middleName': row[3],
            'gender': row[4],
            'dob': row[5],
            'age': row[6],
            'phoneNo': row[7],
            'constituencyAssigned': row[8],
            'pollBoothAssigned': row[9],
            'officialId': row[10],
            'officialRank': row[11],
            'higherRankId': row[12]
        })

    return jsonify(official_details)

@app.route('/api/constituencies', methods=['GET'])
def get_constituencies():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT constituency_id, constituency_name, voter_count, state FROM constituency")
    constituencies = cursor.fetchall()
    cursor.close()

    response = []
    for constituency in constituencies:
        response.append({
            'id': constituency[0],
            'name': constituency[1],
            'voter_count': constituency[2],
            'state': constituency[3]
        })

    return jsonify(response), 200

@app.route('/api/constituencies', methods=['POST'])
def add_constituency():
    data = request.get_json()
    name = data['name']
    state = data['state']

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO constituency (constituency_name, state) VALUES (%s, %s)", (name, state))
    mysql.connection.commit()
    new_id = cursor.lastrowid
    cursor.close()

    return jsonify({'id': new_id, 'name': name, 'state': state}), 201


@app.route('/api/pollbooths', methods=['GET'])
def get_pollbooths():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT poll_booth_id, poll_booth_address, voter_count, evm_vvpat_no, constituency_id FROM poll_booth")
    pollbooths = cursor.fetchall()
    cursor.close()

    response = []
    for pollbooth in pollbooths:
        response.append({
            'poll_booth_id': pollbooth[0],
            'poll_booth_address': pollbooth[1],
            'voter_count': pollbooth[2],
            'evm_vvpat_no': pollbooth[3],
            'constituency_id': pollbooth[4]
        })

    return jsonify(response), 200

@app.route('/api/pollbooths', methods=['POST'])
def add_pollbooth():
    data = request.get_json()
    poll_booth_address = data['poll_booth_address']
    evm_vvpat_no = data['evm_vvpat_no']
    constituency_id = data['constituency_id']

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO poll_booth (poll_booth_address, evm_vvpat_no, constituency_id) VALUES (%s, %s, %s)", (poll_booth_address, evm_vvpat_no, constituency_id))
    mysql.connection.commit()
    new_id = cursor.lastrowid
    cursor.close()

    return jsonify({'poll_booth_id': new_id, 'poll_booth_address': poll_booth_address, 'evm_vvpat_no': evm_vvpat_no, 'constituency_id': constituency_id}), 201


@app.route('/api/elections', methods=['GET'])
def get_elections():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT election_id, election_type, seats, dateofelection, winner FROM election")
    elections = cursor.fetchall()
    cursor.close()

    response = []
    for election in elections:
        response.append({
            'election_id': election[0],
            'election_type': election[1],
            'seats': election[2],
            'dateofelection': election[3],
            'winner': election[4]
        })

    return jsonify(response), 200

@app.route('/api/elections', methods=['POST'])
def add_election():
    data = request.get_json()
    election_type = data['election_type']
    seats = data['seats']
    dateofelection = data['dateofelection']
    winner = data['winner']

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO election (election_type, seats, dateofelection, winner) VALUES (%s, %s, %s, %s)", (election_type, seats, dateofelection, winner))
    mysql.connection.commit()
    new_id = cursor.lastrowid
    cursor.close()

    return jsonify({'election_id': new_id, 'election_type': election_type, 'seats': seats, 'dateofelection': dateofelection, 'winner': winner}), 201

@app.route('/api/voters', methods=['POST'])
def add_voter():
    data = request.get_json()
    aadhar_id = data['aadharId']
    first_name = data['firstName']
    middle_name = data['middleName']
    last_name = data['lastName']
    gender = data['gender']
    dob = data['dob']
    age = data['age']
    state = data['state']
    phone_no = data['phoneNumber']
    constituency_name = data['constituencyName']
    poll_booth_id = data['pollingBoothId']
    voter_id = data['voterId']

    cursor = mysql.connection.cursor()
    try:
        cursor.execute("""
            INSERT INTO voter (aadhar_id, first_name, middle_name, last_name, gender, dob, age, state, phone_no, constituency_name, poll_booth_id, voter_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (aadhar_id, first_name, middle_name, last_name, gender, dob, age, state, phone_no, constituency_name, poll_booth_id, voter_id))
        mysql.connection.commit()
    except MySQLdb.IntegrityError as e:
        if e.args[0] == 1062:
            return jsonify({'message': 'Duplicate entry for voter_id'}), 400
        else:
            raise
    finally:
        cursor.close()

    return jsonify({'message': 'Voter added successfully'}), 201

def add_official():
    data = request.get_json()
    aadhar_id = data['aadharId']
    first_name = data['firstName']
    middle_name = data['middleName']
    last_name = data['lastName']
    gender = data['gender']
    dob = data['dob']
    age = data['age']
    phone_no = data['phoneNumber']
    constituency_assigned = data['constituencyAssigned']
    poll_booth_assigned = data['pollBoothAssigned']
    official_id = data['officialId']
    official_rank = data['officialRank']
    higher_rank_id = data['higherRankId']

    cursor = mysql.connection.cursor()
    try:
        cursor.execute("""
            INSERT INTO official (aadhar_id, first_name, middle_name, last_name, gender, dob, age, phone_no, constituency_assigned, poll_booth_assigned, official_id, official_rank, higher_rank_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (aadhar_id, first_name, middle_name, last_name, gender, dob, age, phone_no, constituency_assigned, poll_booth_assigned, official_id, official_rank, higher_rank_id))
        mysql.connection.commit()
    except MySQLdb.IntegrityError as e:
        if e.args[0] == 1062:
            return jsonify({'message': 'Duplicate entry for official_id'}), 400
        else:
            raise
    finally:
        cursor.close()

    return jsonify({'message': 'Official added successfully'}), 201

def add_candidate():
    data = request.get_json()
    aadhar_id = data['aadharId']
    first_name = data['firstName']
    middle_name = data['middleName']
    last_name = data['lastName']
    gender = data['gender']
    dob = data['dob']
    age = data['age']
    phone_no = data['phone']
    cons_fight = data['constituency']
    candidate_id = data['candidateId']
    party_rep = data['partyRep']

    cursor = mysql.connection.cursor()
    try:
        cursor.execute("""
            INSERT INTO candidate (aadhar_id, first_name, middle_name, last_name, gender, dob, age, phone_no, cons_fight, candidate_id, party_rep)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (aadhar_id, first_name, middle_name, last_name, gender, dob, age, phone_no, cons_fight, candidate_id, party_rep))
        mysql.connection.commit()
    except MySQLdb.IntegrityError as e:
        if e.args[0] == 1062:
            return jsonify({'message': 'Duplicate entry for candidate_id'}), 400
        else:
            raise
    finally:
        cursor.close()

    return jsonify({'message': 'Candidate added successfully'}), 201


@app.route('/updateCandidate', methods=['POST'])
def update_candidate():
    data = request.get_json()
    aadhar_id = data['aadharId']
    first_name = data['firstName']
    middle_name = data['middleName']
    last_name = data['lastName']
    gender = data['gender']
    dob = data['dob']
    phone_no = data['phone']
    cons_fight = data['constituency']
    candidate_id = data['candidateId']
    party_rep = data['partyRep']

    cursor = mysql.connection.cursor()
    cursor.execute("""
        UPDATE candidate
        SET first_name = %s, middle_name = %s, last_name = %s, gender = %s, dob = %s, phone_no = %s, cons_fight = %s, candidate_id = %s, party_rep = %s
        WHERE aadhar_id = %s
    """, (first_name, middle_name, last_name, gender, dob, phone_no, cons_fight, candidate_id, party_rep, aadhar_id))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Candidate updated successfully'}), 200

@app.route('/deleteCandidate', methods=['POST'])
def delete_candidate():
    data = request.get_json()
    aadhar_id = data['aadharId']

    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM candidate WHERE aadhar_id = %s", (aadhar_id,))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Candidate deleted successfully'}), 200


@app.route('/updateOfficial', methods=['POST'])
def update_official():
    data = request.get_json()
    aadhar_id = data['aadharId']
    first_name = data['firstName']
    middle_name = data['middleName']
    last_name = data['lastName']
    gender = data['gender']
    dob = data['dob']
    phone_no = data['phone']
    constituency_assigned = data['constituencyAssigned']
    poll_booth_assigned = data['pollBoothAssigned']
    official_id = data['officialID']

    cursor = mysql.connection.cursor()
    cursor.execute("""
        UPDATE official
        SET first_name = %s, middle_name = %s, last_name = %s, gender = %s, dob = %s, phone_no = %s, constituency_assigned = %s, poll_booth_assigned = %s, official_id = %s
        WHERE aadhar_id = %s
    """, (first_name, middle_name, last_name, gender, dob, phone_no, constituency_assigned, poll_booth_assigned, official_id, aadhar_id))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Official updated successfully'}), 200

@app.route('/deleteOfficial', methods=['POST'])
def delete_official():
    data = request.get_json()
    aadhar_id = data['aadharId']

    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM official WHERE aadhar_id = %s", (aadhar_id,))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Official deleted successfully'}), 200


@app.route('/updateParty', methods=['POST'])
def update_party():
    data = request.get_json()
    party_name = data['partyName']
    party_symbol = data['partySymbol']
    president = data['president']
    party_funds = data['partyFunds']
    headquarters = data['headquarters']
    party_member_count = data['partyMemberCount']

    cursor = mysql.connection.cursor()
    cursor.execute("""
        UPDATE party
        SET party_symbol = %s, president = %s, party_funds = %s, headquarters = %s, party_member_count = %s
        WHERE party_name = %s
    """, (party_symbol, president, party_funds, headquarters, party_member_count, party_name))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Party updated successfully'}), 200


@app.route('/registerCandidate', methods=['POST'])
def register_candidate():
    data = request.get_json()
    aadhar_id = data['aadharId']
    first_name = data['firstName']
    middle_name = data['middleName']
    last_name = data['lastName']
    gender = data['gender']
    dob = data['dob']
    state = data['state']
    phone_no = data['phone']
    constituency_name = data['constituencyName']
    party_name = data['partyName']

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO candidate (aadhar_id, first_name, middle_name, last_name, gender, dob, state, phone_no, constituency_name, party_name)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (aadhar_id, first_name, middle_name, last_name, gender, dob, state, phone_no, constituency_name, party_name))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Candidate registered successfully'}), 201

@app.route('/deleteParty', methods=['POST'])
def delete_party():
    data = request.get_json()
    party_name = data['partyName']

    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM party WHERE party_name = %s", (party_name,))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Party deleted successfully'}), 200


@app.route('/updateVoter', methods=['POST'])
def update_voter():
    data = request.get_json()
    aadhar_id = data['aadharId']
    first_name = data['firstName']
    middle_name = data['middleName']
    last_name = data['lastName']
    gender = data['gender']
    dob = data['dob']
    state = data['state']
    phone_no = data['phone']
    voter_id = data['voterId']

    cursor = mysql.connection.cursor()
    cursor.execute("""
        UPDATE voter
        SET first_name = %s, middle_name = %s, last_name = %s, gender = %s, dob = %s, state = %s, phone_no = %s, voter_id = %s
        WHERE aadhar_id = %s
    """, (first_name, middle_name, last_name, gender, dob, state, phone_no, voter_id, aadhar_id))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Voter updated successfully'}), 200

@app.route('/deleteVoter', methods=['POST'])
def delete_voter():
    data = request.get_json()
    aadhar_id = data['aadharId']

    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM voter WHERE aadhar_id = %s", (aadhar_id,))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Voter deleted successfully'}), 200


def check_official_role(aadhar_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT role FROM login WHERE aadhar_id = %s", (aadhar_id,))
    role = cursor.fetchone()
    cursor.close()
    return role and role[0] == 'official'

@app.route('/getvoterinformation', methods=['GET'])
def get_voter_information():
    aadhar_id = request.args.get('aadharId')
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM voter")
    voter = cursor.fetchone()
    cursor.close()

    if voter:
        voter_data = {
            'aadharId': voter[0],
            'firstName': voter[1],
            'middleName': voter[2],
            'lastName': voter[3],
            'gender': voter[4],
            'dob': voter[5],
            'age': voter[6],
            'state': voter[7],
            'phoneNumber': voter[8],
            'constituencyName': voter[9],
            'pollingBoothId': voter[10],
            'voterId': voter[11]
        }
        return jsonify(voter_data)
    else:
        return jsonify({'message': 'Voter not found'}), 404
    
@app.route('/getConstDeets', methods=['GET'])
def get_const_deets():
    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT constituency_name, 
               SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) AS male_count,
               SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) AS female_count,
               COUNT(DISTINCT poll_booth_id) AS poll_booth_count
        FROM voter
        GROUP BY constituency_name
    """)
    results = cursor.fetchall()
    cursor.close()

    constituency_data = []
    for row in results:
        constituency_data.append({
            'constituencyName': row[0],
            'maleCount': row[1],
            'femaleCount': row[2],
            'pollBoothCount': row[3]
        })

    return jsonify(constituency_data)



# @app.route('/deleteParty', methods=['POST'])
# def delete_party():
#     data = request.get_json()
#     aadhar_id = data['aadharId']
#     party_name = data['partyName']

#     if not check_official_role(aadhar_id):
#         return jsonify({'message': 'Unauthorized'}), 403

#     cursor = mysql.connection.cursor()
#     cursor.execute("DELETE FROM party WHERE party_name = %s", (party_name,))
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Party deleted successfully'}), 200

# @app.route('/deletePollBooth', methods=['POST'])
# def delete_poll_booth():
#     data = request.get_json()
#     aadhar_id = data['aadharId']
#     poll_booth_id = data['pollBoothId']

#     if not check_official_role(aadhar_id):
#         return jsonify({'message': 'Unauthorized'}), 403

#     cursor = mysql.connection.cursor()
#     cursor.execute("DELETE FROM poll_booth WHERE poll_booth_id = %s", (poll_booth_id,))
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Poll booth deleted successfully'}), 200

# @app.route('/deleteElection', methods=['POST'])
# def delete_election():
#     data = request.get_json()
#     aadhar_id = data['aadharId']
#     election_id = data['electionId']

#     if not check_official_role(aadhar_id):
#         return jsonify({'message': 'Unauthorized'}), 403

#     cursor = mysql.connection.cursor()
#     cursor.execute("DELETE FROM election WHERE election_id = %s", (election_id,))
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Election deleted successfully'}), 200

# @app.route('/deleteCandidate', methods=['POST'])
# def delete_candidate():
#     data = request.get_json()
#     aadhar_id = data['aadharId']
#     candidate_id = data['candidateId']

#     if not check_official_role(aadhar_id):
#         return jsonify({'message': 'Unauthorized'}), 403

#     cursor = mysql.connection.cursor()
#     cursor.execute("DELETE FROM candidate WHERE candidate_id = %s", (candidate_id,))
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Candidate deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)

# from flask import Flask, request, jsonify
# from flask_mysqldb import MySQL
# from flask_bcrypt import Bcrypt
# from flask_cors import CORS
# from dotenv import load_dotenv
# import os

# app = Flask(__name__)
# CORS(app)
# bcrypt = Bcrypt(app)

# # Load environment variables from .env file
# load_dotenv()

# # MySQL configurations using environment variables
# app.config['MYSQL_HOST'] = os.getenv('DB_HOST')
# app.config['MYSQL_USER'] = os.getenv('DB_USER')
# app.config['MYSQL_PASSWORD'] = os.getenv('DB_PASSWORD')
# app.config['MYSQL_DB'] = os.getenv('DB_NAME')
# app.config['MYSQL_PORT'] = int(os.getenv('DB_PORT'))

# mysql = MySQL(app)

# class FormData:
#     def __init__(self, data):
#         self.aadhar_id = data.get('aadharId')
#         self.first_name = data.get('firstName')
#         self.middle_name = data.get('middleName')
#         self.last_name = data.get('lastName')
#         self.gender = data.get('gender')
#         self.dob = data.get('dob')
#         self.age = data.get('age')
#         self.state = data.get('state')
#         self.phone_number = data.get('phone')
#         self.constituency_name = data.get('constituency')
#         self.polling_booth_id = data.get('pollingBoothId')
#         self.voter_id = data.get('voterId')
#         self.candidate_id = data.get('candidateId')
#         self.party_rep = data.get('partyRep')
#         self.party_name = data.get('partyName')
#         self.party_symbol = data.get('partySymbol')
#         self.party_president = data.get('president')
#         self.party_funds = data.get('partyFunds')
#         self.headquarters = data.get('headquarters')
#         self.party_leader = data.get('partyLeader')
#         self.seats_won = data.get('seatsWon')
#         self.user_name = data.get('userName')
#         self.password = data.get('password')
#         self.role = data.get('role')
#         self.election_id = data.get('electionId')
#         self.election_type = data.get('electionType')
#         self.date_of_election = data.get('electionDate')
#         self.seats = data.get('seats')
#         self.official_id = data.get('officialId')
#         self.constituency_assigned = data.get('constituencyAssigned')
#         self.poll_booth_assigned = data.get('pollBoothAssigned')
#         self.higher_rank_id = data.get('higherRankId')
#         self.official_rank = data.get('officialRank')
#         self.party_member_count = data.get('partyMemberCount')

# def hash_password(password):
#     return bcrypt.generate_password_hash(password).decode('utf-8')

# @app.route('/api/auth/login', methods=['POST'])
# def handle_login():
#     data = request.get_json()
#     form_data = FormData(data)
#     cursor = mysql.connection.cursor()
#     cursor.execute("SELECT * FROM login WHERE aadhar_id = %s", (form_data.aadhar_id,))
#     user = cursor.fetchone()
#     cursor.close()

#     if user and bcrypt.check_password_hash(user[1], form_data.password):
#         response_data = {
#             'aadhar_id': user[0],
#             'role': user[2],
#             'party_name': user[3]
#         }
#         return jsonify(response_data), 200
#     else:
#         return jsonify({'error': 'Invalid credentials'}), 400


# def insert_voter(data):
#     cursor = mysql.connection.cursor()
#     cursor.execute(
#         "INSERT INTO voter (aadhar_id, first_name, last_name, middle_name, gender, dob, phone_no, state, constituency_name, polling_booth_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
#         (data.aadhar_id, data.first_name, data.last_name, data.middle_name, data.gender, data.dob, data.phone_number, data.state, data.constituency_name, data.polling_booth_id)
#     )
#     mysql.connection.commit()
#     cursor.close()

# def insert_candidate(data):
#     cursor = mysql.connection.cursor()
#     cursor.execute(
#         "INSERT INTO candidate (aadhar_id, first_name, last_name, middle_name, gender, dob, phone_no, cons_fight, party_rep) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
#         (data.aadhar_id, data.first_name, data.last_name, data.middle_name, data.gender, data.dob, data.phone_number, data.constituency_name, data.party_rep)
#     )
#     mysql.connection.commit()
#     cursor.close()

# def insert_party(data):
#     cursor = mysql.connection.cursor()
#     cursor.execute(
#         "INSERT INTO party (party_name, party_symbol, president, party_funds, headquarters, seats_won) VALUES (%s, %s, %s, %s, %s, %s)",
#         (data.party_name, data.party_symbol, data.party_president, data.party_funds, data.headquarters, data.seats_won)
#     )
#     mysql.connection.commit()
#     cursor.close()

# @app.route('/api/auth/register', methods=['POST'])
# def handle_registration():
#     data = request.get_json()
#     form_data = FormData(data)
#     hashed_password = hash_password(form_data.password)

#     if form_data.role == 'voter':
#         insert_voter(form_data)
#     elif form_data.role == 'candidate':
#         insert_candidate(form_data)
#     elif form_data.role == 'party':
#         insert_party(form_data)
#     insert_user(form_data, hashed_password)

#     return jsonify({'message': 'User registered successfully'}), 201

# @app.route('/getConstDeets', methods=['GET'])
# def get_const_deets():
#     cursor = mysql.connection.cursor()
#     cursor.execute("CALL getconsdets()")
#     results = cursor.fetchall()
#     cursor.close()

#     response = []
#     for row in results:
#         response.append({
#             'constituencyName': row[0],
#             'maleCount': row[1],
#             'femaleCount': row[2],
#             'pollBoothCount': row[3]
#         })

#     return jsonify(response), 200

# @app.route('/getvoterinformation', methods=['GET'])
# def get_voter_information():
#     aadhar_id = request.args.get('aadharId')
#     if not aadhar_id:
#         return jsonify({'error': 'Aadhar ID is required'}), 400

#     cursor = mysql.connection.cursor()
#     cursor.execute("SELECT * FROM voter WHERE aadhar_id = %s", (aadhar_id,))
#     voter = cursor.fetchone()
#     cursor.close()

#     if not voter:
#         return jsonify({'error': 'Voter not found'}), 404

#     response = {
#         'aadharId': voter[0],
#         'firstName': voter[1],
#         'lastName': voter[2],
#         'middleName': voter[3],
#         'gender': voter[4],
#         'dob': voter[5],
#         'age': voter[6],
#         'state': voter[7],
#         'phoneNumber': voter[8],
#         'constituencyName': voter[9],
#         'pollingBoothId': voter[10],
#         'voterId': voter[11]
#     }

#     return jsonify(response), 200

# @app.route('/getcandidateinformation', methods=['GET'])
# def get_candidate_information():
#     aadhar_id = request.args.get('aadharId')
#     if not aadhar_id:
#         return jsonify({'error': 'Aadhar ID is required'}), 400

#     cursor = mysql.connection.cursor()
#     cursor.execute("SELECT * FROM candidate WHERE aadhar_id = %s", (aadhar_id,))
#     candidate = cursor.fetchone()
#     cursor.close()

#     if not candidate:
#         return jsonify({'error': 'Candidate not found'}), 404

#     response = {
#         'aadharId': candidate[0],
#         'firstName': candidate[1],
#         'lastName': candidate[2],
#         'middleName': candidate[3],
#         'gender': candidate[4],
#         'dob': candidate[5],
#         'age': candidate[6],
#         'phoneNumber': candidate[7],
#         'constituencyFighting': candidate[8],
#         'candidateId': candidate[9],
#         'partyRep': candidate[10]
#     }

#     return jsonify(response), 200

# @app.route('/getpartyinformation', methods=['GET'])
# def get_party_information():
#     party_name = request.args.get('partyName')
#     if not party_name:
#         return jsonify({'error': 'Party name is required'}), 400

#     cursor = mysql.connection.cursor()
#     cursor.execute("SELECT party_name, party_symbol, president, party_funds, headquarters, seats_won, party_member_count FROM party WHERE party_name = %s", (party_name,))
#     party = cursor.fetchone()
#     cursor.close()

#     if not party:
#         return jsonify({'error': 'Party not found'}), 404

#     response = {
#         'partyName': party[0],
#         'partySymbol': party[1],
#         'president': party[2],
#         'partyFunds': party[3],
#         'headquarters': party[4],
#         'seatsWon': party[5],
#         'partyMemberCount': party[6]
#     }

#     return jsonify(response), 200

# @app.route('/getofficialinformation', methods=['GET'])
# def get_official_information():
#     aadhar_id = request.args.get('aadharId')
#     if not aadhar_id:
#         return jsonify({'error': 'Aadhar ID is required'}), 400

#     cursor = mysql.connection.cursor()
#     cursor.execute("SELECT aadhar_id, first_name, last_name, middle_name, gender, dob, age, phone_no, constituency_assigned, poll_booth_assigned, official_id, official_rank, higher_rank_id FROM official WHERE aadhar_id = %s", (aadhar_id,))
#     official = cursor.fetchone()
#     cursor.close()

#     if not official:
#         return jsonify({'error': 'Official not found'}), 404

#     response = {
#         'aadharId': official[0],
#         'firstName': official[1],
#         'lastName': official[2],
#         'middleName': official[3],
#         'gender': official[4],
#         'dob': official[5],
#         'age': official[6],
#         'phoneNumber': official[7],
#         'constituencyAssigned': official[8],
#         'pollBoothAssigned': official[9],
#         'officialId': official[10],
#         'officialRank': official[11],
#         'higherRankId': official[12]
#     }

#     return jsonify(response), 200

# @app.route('/updateElection', methods=['PUT'])
# def handle_update_election():
#     data = request.get_json()
#     form_data = FormData(data)

#     cursor = mysql.connection.cursor()
#     cursor.execute(
#         "UPDATE election SET election_type = %s, seats = %s, dateofelection = %s WHERE election_id = %s",
#         (form_data.election_type, form_data.seats, form_data.date_of_election, form_data.election_id)
#     )
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Election updated successfully'}), 200

# @app.route('/deleteElection', methods=['DELETE'])
# def handle_delete_election():
#     data = request.get_json()
#     form_data = FormData(data)

#     cursor = mysql.connection.cursor()
#     cursor.execute("DELETE FROM election WHERE election_id = %s", (form_data.election_id,))
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Election deleted successfully'}), 200

# @app.route('/updateVoter', methods=['PUT'])
# def handle_update_voter():
#     data = request.get_json()
#     form_data = FormData(data)

#     cursor = mysql.connection.cursor()
#     cursor.execute(
#         "UPDATE voter SET voter_id = %s, first_name = %s, last_name = %s, middle_name = %s, gender = %s, dob = %s, state = %s, phone_no = %s WHERE aadhar_id = %s",
#         (form_data.voter_id, form_data.first_name, form_data.last_name, form_data.middle_name, form_data.gender, form_data.dob, form_data.state, form_data.phone_number, form_data.aadhar_id)
#     )
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Voter updated successfully'}), 200

# @app.route('/updateParty', methods=['PUT'])
# def handle_update_party():
#     data = request.get_json()
#     form_data = FormData(data)

#     cursor = mysql.connection.cursor()
#     cursor.execute(
#         "UPDATE party SET party_symbol = %s, president = %s, party_funds = %s, headquarters = %s, party_member_count = %s WHERE party_name = %s",
#         (form_data.party_symbol, form_data.party_president, form_data.party_funds, form_data.headquarters, form_data.party_member_count, form_data.party_name)
#     )
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Party updated successfully'}), 200

# @app.route('/updateCandidate', methods=['PUT'])
# def handle_update_candidate():
#     data = request.get_json()
#     form_data = FormData(data)

#     cursor = mysql.connection.cursor()
#     cursor.execute(
#         "UPDATE candidate SET first_name = %s, last_name = %s, middle_name = %s, gender = %s, dob = %s, phone_no = %s, cons_fight = %s, candidate_id = %s, party_rep = %s WHERE aadhar_id = %s",
#         (form_data.first_name, form_data.last_name, form_data.middle_name, form_data.gender, form_data.dob, form_data.phone_number, form_data.constituency_name, form_data.candidate_id, form_data.party_rep, form_data.aadhar_id)
#     )
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Candidate updated successfully'}), 200

# @app.route('/updateOfficial', methods=['PUT'])
# def handle_update_official():
#     data = request.get_json()
#     form_data = FormData(data)

#     cursor = mysql.connection.cursor()
#     cursor.execute(
#         "UPDATE official SET first_name = %s, last_name = %s, middle_name = %s, gender = %s, dob = %s, phone_no = %s, constituency_assigned = %s, poll_booth_assigned = %s WHERE aadhar_id = %s",
#         (form_data.first_name, form_data.last_name, form_data.middle_name, form_data.gender, form_data.dob, form_data.phone_number, form_data.constituency_assigned, form_data.poll_booth_assigned, form_data.aadhar_id)
#     )
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Official updated successfully'}), 200

# @app.route('/deleteVoter', methods=['DELETE'])
# def handle_delete_voter():
#     data = request.get_json()
#     form_data = FormData(data)

#     cursor = mysql.connection.cursor()
#     cursor.execute("DELETE FROM voter WHERE aadhar_id = %s", (form_data.aadhar_id,))
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Voter deleted successfully'}), 200

# @app.route('/deleteCandidate', methods=['DELETE'])
# def handle_delete_candidate():
#     data = request.get_json()
#     form_data = FormData(data)

#     cursor = mysql.connection.cursor()
#     cursor.execute("DELETE FROM candidate WHERE aadhar_id = %s", (form_data.aadhar_id,))
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Candidate deleted successfully'}), 200

# @app.route('/deleteParty', methods=['DELETE'])
# def handle_delete_party():
#     data = request.get_json()
#     form_data = FormData(data)

#     cursor = mysql.connection.cursor()
#     cursor.execute("DELETE FROM party WHERE party_name = %s", (form_data.party_name,))
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Party deleted successfully'}), 200

# @app.route('/deleteOfficial', methods=['DELETE'])
# def handle_delete_official():
#     data = request.get_json()
#     form_data = FormData(data)

#     cursor = mysql.connection.cursor()
#     cursor.execute("DELETE FROM official WHERE aadhar_id = %s", (form_data.aadhar_id,))
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Official deleted successfully'}), 200

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)