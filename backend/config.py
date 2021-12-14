import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

class DevelopmentConfig():
  DEBUG = True
  MYSQL_USER = os.getenv('USER')
  MYSQL_PASSWORD = os.getenv('PASSWORD')
  MYSQL_HOST = os.getenv('HOST')
  MYSQL_DB = os.getenv('DB')
  
Config = {
  'development': DevelopmentConfig
}