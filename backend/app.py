from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from types import MethodType
from flask_cors import CORS
from config import Config

app = Flask(__name__)
conexion = MySQL(app)
CORS(app)

@app.route('/')
def Principal():
  return PatientList()

@app.route('/patient-list')
def PatientList():
  try:
    query = 'select * from patient'
    cursor = conexion.connection.cursor()
    cursor.execute(query)

    return jsonify(cursor.fetchall())
  except Exception as exception:
    return jsonify(exception)

@app.route('/greater-number-of-patients')
def GreaterNumberOfPatients():
  try:
    query = 'select * from consultation order by patients_quantity desc limit 1'
    cursor = conexion.connection.cursor()
    cursor.execute(query)

    return jsonify(cursor.fetchall())
  except Exception as exception:
    return jsonify(exception)

@app.route('/release-consultations')
def ReleaseConsultations():
  try:
    query = 'update consultation set consultation_state = 2'
    cursor = conexion.connection.cursor()
    cursor.execute(query)
    conexion.connection.commit()

    return jsonify('Consultations Modified')
  except Exception as exception:
    return jsonify(exception)

@app.route('/smoker-patients')
def SmokerPatients():
  try:
    query = '''
      select patientyoung.patient_id, patientyoung.smoker_years, patient.name, patient.year_old
      from patientyoung inner join patient on patient.id = patientyoung.patient_id
      where patientyoung.smoker = 1
    '''
    cursor = conexion.connection.cursor()
    cursor.execute(query)

    return jsonify(cursor.fetchall())
  except Exception as exception:
    return jsonify(exception)

@app.route('/patient-kid')
def PatientKid():
  try:
    query = '''
      select patientkid.patient_id, patientkid.height_weight_ratio,
      patient.name, patient.year_old, patient.medical_history_number
      from patientkid inner join patient on patient.id = patientkid.patient_id
    '''
    cursor = conexion.connection.cursor()
    cursor.execute(query)

    return jsonify(cursor.fetchall())
  except Exception as exception:
    return jsonify(exception)

@app.route('/patient-young')
def PatientYoung():
  try:
    query = '''
      select patientyoung.patient_id, patientyoung.smoker,
      patientyoung.smoker_years, patient.name, patient.year_old, patient.medical_history_number
      from patientyoung inner join patient on patient.id = patientyoung.patient_id
    '''
    cursor = conexion.connection.cursor()
    cursor.execute(query)

    return jsonify(cursor.fetchall())
  except Exception as exception:
    return jsonify(exception)

@app.route('/patient-old')
def PatientOld():
  try:
    query = '''
      select patientold.patient_id, patientold.assigned_diet,
      patient.name, patient.year_old, patient.medical_history_number
      from patientold inner join patient on patient.id = patientold.patient_id
    '''
    cursor = conexion.connection.cursor()
    cursor.execute(query)

    return jsonify(cursor.fetchall())
  except Exception as exception:
    return jsonify(exception)

@app.route('/find-patient/<string:history>')
def FindPatient(history):
  try:
    query = 'select * from patient where medical_history_number = {0}'
    cursor = conexion.connection.cursor()
    cursor.execute(query.format(history))

    return jsonify(cursor.fetchone())
  except Exception as exception:
    return jsonify(exception)

@app.route('/new-consultation', methods=['POST'])
def NewConsultation():
  try:
    patients_quantity = request.json['patients_quantity']
    consultation_state = request.json['consultation_state']
    consultation_type = request.json['consultation_type']
    specialist_name = request.json['specialist_name']

    query = '''
      insert into Consultation(patients_quantity, specialist_name, consultation_type, consultation_state)
      values(%s, %s, %s, %s)
    '''
    cursor = conexion.connection.cursor()
    cursor.execute(query, (patients_quantity, specialist_name, consultation_type, consultation_state))
    conexion.connection.commit()

    return jsonify('Added')
  except Exception as exception:
    return jsonify(exception)

def NotFound():
  return jsonify('Resource Not Found')

if __name__ == '__main__':
  app.config.from_object(Config['development'])
  app.register_error_handler(404, NotFound)
  app.run()