from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS
from config import Config

app = Flask(__name__)
assistant = MySQL(app)
CORS(app)

@app.route('/')
def Principal():
  return PatientList()

@app.route('/patient-list')
def PatientList():
  try:
    query = 'select * from patient'
    cursor = assistant.connection.cursor()
    cursor.execute(query)

    return jsonify(cursor.fetchall())
  except Exception as exception:
    return jsonify(exception.args)

@app.route('/smoker-patients')
def SmokerPatients():
  try:
    query = 'select patient_id from patientyoung where smoker = 1'
    cursor = assistant.connection.cursor()
    cursor.execute(query)

    return jsonify(cursor.fetchall())
  except Exception as exception:
    return jsonify(exception.args)

@app.route('/patient-kid')
def PatientKid():
  try:
    query = '''
      select patientkid.patient_id, patientkid.height_weight_ratio,
      patient.name, patient.year_old, patient.medical_history_number
      from patientkid inner join patient on patient.id = patientkid.patient_id
    '''
    cursor = assistant.connection.cursor()
    cursor.execute(query)

    return jsonify(cursor.fetchall())
  except Exception as exception:
    return jsonify(exception.args)

@app.route('/patient-young')
def PatientYoung():
  try:
    query = '''
      select patientyoung.patient_id, patientyoung.smoker,
      patientyoung.smoker_years, patient.name, patient.year_old, patient.medical_history_number
      from patientyoung inner join patient on patient.id = patientyoung.patient_id
    '''
    cursor = assistant.connection.cursor()
    cursor.execute(query)

    return jsonify(cursor.fetchall())
  except Exception as exception:
    return jsonify(exception.args)

@app.route('/patient-old')
def PatientOld():
  try:
    query = '''
      select patientold.patient_id, patientold.assigned_diet,
      patient.name, patient.year_old, patient.medical_history_number
      from patientold inner join patient on patient.id = patientold.patient_id
    '''
    cursor = assistant.connection.cursor()
    cursor.execute(query)

    return jsonify(cursor.fetchall())
  except Exception as exception:
    return jsonify(exception.args)

@app.route('/greater-number-of-patients')
def GreaterNumberOfPatients():
  try:
    query = 'select * from consultation order by patients_quantity desc limit 1'
    cursor = assistant.connection.cursor()
    cursor.execute(query)

    return jsonify(cursor.fetchone())
  except Exception as exception:
    return jsonify(exception.args)

@app.route('/find-patient/<string:history>')
def FindPatient(history):
  try:
    query = 'select * from patient where medical_history_number = {0}'
    cursor = assistant.connection.cursor()
    cursor.execute(query.format(history))

    return jsonify(cursor.fetchone())
  except Exception as exception:
    return jsonify(exception.args)

@app.route('/consultations')
def Consultations():
  try:
    query = '''
      select * from consultation
    '''
    cursor = assistant.connection.cursor()
    cursor.execute(query)

    return jsonify(cursor.fetchall())
  except Exception as exception:
    return jsonify(exception.args)

@app.route('/new-consultation/<string:type>')
def NewConsultation(type):
  try:
    query = '''
      update consultation set patients_quantity = patients_quantity + 1, consultation_state = 1
      where consultation_type = {0}
    '''
    cursor = assistant.connection.cursor()
    cursor.execute(query.format(type))
    assistant.connection.commit()

    return jsonify('Added')
  except Exception as exception:
    return jsonify(exception.args)

@app.route('/release-consultations')
def ReleaseConsultations():
  try:
    query = 'update consultation set consultation_state = 2'
    cursor = assistant.connection.cursor()
    cursor.execute(query)
    assistant.connection.commit()

    return jsonify('Released')
  except Exception as exception:
    return jsonify(exception.args)

@app.route('/finalize-consultation/<string:type>')
def FinalizeConsultation(type):
  try:
    query = 'update consultation set consultation_state = 2 where consultation_type = {0}'
    cursor = assistant.connection.cursor()
    cursor.execute(query.format(type))
    assistant.connection.commit()

    return jsonify('Modified')
  except Exception as exception:
    return jsonify(exception.args)

def ResourceNotFound():
  return jsonify('Resource Not Found')

if __name__ == '__main__':
  app.config.from_object(Config['development'])
  app.register_error_handler(404, ResourceNotFound)
  app.run()