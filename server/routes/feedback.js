import Feedback from '../model/feedback';

module.exports = app => {
  app.get('/feedback', (req, res) => {
    Feedback.find({})
      .then(data => {
        res.send(data);
      })
      .catch(error => {
        res.status(422).send(error);
      });
  });

  app.post('/feedback', function(req, res) {
    console.log(req.body);
    const { date, message } = req.body;
    // res.send(req);

    const feedback = new Feedback({ date, message });

    feedback
      .save()
      .then(data => {
        console.log('feedback saved');
        res.send('saved');
      })
      .catch(error => {
        console.log(error);
        res.status(422).send(error);
      });
  });

  app.delete('/feedback', (req, res) => {
    console.log(req.body);
    const { id } = req.query;
    console.log(id);

    // res.send(id);

    Feedback.findByIdAndRemove(id)
      .then(data => {
        console.log(data);
        res.send('success');
      })
      .catch(error => {
        console.log(error);
        res.status(422).send(error);
      });
  });
};
