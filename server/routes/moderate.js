import Event from '../model/event';

module.exports = app => {
  app.get('/moderate', (req, res) => {
    Event.find({ status: 'noactive' })
      .limit(50)
      .then(data => {
        res.send(data);
      })
      .catch(error => {
        res.status(422).send(error);
      });
  });

  app.put('/moderate', (req, res) => {
    const { id, moderate } = req.query;
    console.log(id, moderate);

    Event.findByIdAndUpdate(id, { status: moderate === 'true' ? 'active' : 'rejected' })
      .then(() => {
        res.send(true);
      })
      .catch(error => {
        res.status(422).send(error);
      });
  });
};
