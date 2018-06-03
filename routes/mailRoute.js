const express = require('express'),
      router = express.Router(),
      path = require('path'),
      nodemailer = require('nodemailer'),
      Email = require('email-templates');

router.post('/', POST_Share);

module.exports = router;

function POST_Share(req, res, next) {

    var transporter = nodemailer.createTransport ({
        service: 'Gmail',
        auth: {
            user: 'w.robingross@gmail.com', 
            pass: 'Motdepasse123' 
        }
    });

    const email = new Email ({
        message: {
          from: 'contact@supfile.com'
        },
        // uncomment below to send emails in development/test env:
        // send: true
        transport: transporter,
        juice: true,
        juiceResources: {
          preserveImportant: true,
          webResources: {
            relativeTo: path.resolve('emails')
          }
        },
    }); 

    email.send ({
        template: 'subscribe',
        message: {
            to: 'w.robingross@gmail.com'
        },
        locals: {
            name: 'Elon',
            link: 'http://supfile.org/inscription/id'
        }
    })
    .then(function () {res.send({status : 'OK', statusCode : 200 })})
    .catch(console.error);
/*
    var mailOptions = {
        from: 'contact@supfile.org>',
        to: 'w.robingross@gmail.com',
        subject: 'Email Example',
        text: 'Coucou'
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if(error){
            console.log(error);
            res.json({yo: 'error'});
        }else{
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        };
    });
    */
}