module.exports = {
  'secret': 'super secret passphrase',
  'database_local': 'mongodb://localhost:27017/supfile',
  'database_prod': {
    'host': 'mongodb://167.99.45.221:27017/supfile',
    'user': 'dev',
    'password': 'devDEV'
  },
  'total_virus_apikey' : '757a1d88ac615d9436c6fecfdb63ecfe5c7732b098bf15d0eaf2382ab96f9c1c',
  'data_path_local' : '../folders',
  'data_path_prod' : '/home/stockage',
  'fbConfig': {
    'appID' : '1487784628006176',
    'appSecret' : 'bcd0af926a4722fa8f2beb90b54798f4'
  },
  'glConfig' : {
    'appID' : '264544487772-pjnoseir23t4cfod8bu6bc24d020ra7q.apps.googleusercontent.com',
    'appSecret' : 'FrPHEbr9EnrhS2AwUn_Dx1HF'
  },
  'port': process.env.PORT || 3000
}
