const brevo = require('@getbrevo/brevo');

export async function POST (request) {


  const emailData = await request.json();


  const { email, firstName, date, appointment, address } = emailData;

    let apiInstance = new brevo.TransactionalEmailsApi();

    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Your appointment is confirmed!";
    sendSmtpEmail.templateId = 1;
    sendSmtpEmail.sender = { "name": "Broken Pipe Plumbing", "email": "georgeliu8110@gmail.com" };
    sendSmtpEmail.to = [{ email, name: firstName }]
    sendSmtpEmail.replyTo = { "email": "georgeliu8110@gmail.com", "name": "Broken Pipe Plumbing" };
    sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    sendSmtpEmail.params = {
              firstName,
              appointmentDate: date,
              appointmentTime: appointment,
              address
            },


    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
      console.error(error);
    });
    return new Response('success!', {
      status: 200,
    });
    }