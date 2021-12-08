from flask import Flask, jsonify
from flask_mysqldb import MySQL
from config import Config

app = Flask(__name__)
conexion = MySQL(app)

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

def NotFound(error):
  return jsonify('Resource Not Found')

if __name__ == '__main__':
  app.config.from_object(Config['development'])
  app.register_error_handler(404, NotFound)
  app.run()