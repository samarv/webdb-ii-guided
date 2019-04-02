const router = require('express').Router();
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    //relative to root
    filename: './data/rolex.db3',
  }
}

const db = knex(knexConfig);

router.get('/', (req, res) => {
  // get the roles from the database
  db('roles')
    .then(roles => res.status(200).json(roles))
    .catch(error => {
      res.status(500).json(error);
    })
});

router.get('/:id', (req, res) => {
  // retrieve a role by id
  db('roles')
    .where({ id: req.params.id})
    .then(roles => {
      if(role){
        res.status(200).json(roles[0])
      } else{
        res.status(404).json({message: 'roles not found'})
      }
    })
    .catch(error => {
      res.status(500).json(error);
    })
});

router.post('/', (req, res) => {
  // add a role to the database
  db('roles')
    .insert(req.body)
    .then(([id]) => {
      db('roles')
      .where({ id })
      .first()
      .then(role => {
        res.status(200).json(role)
      })
      .catch(error => {
        res.status(500).json(error);
      })
    })
});

router.put('/:id', (req, res) => {
  // update roles
  db('roles')
  .where({ id: req.params.id})
  .update(req.body)
  .then(count => {
    if(count > 0){
      db(roles)
        .where({ id: req.params.id})
        .then(role => {
          res.status(200).json(role);
        })
    }
    else{
      res.status(404).json({message: "role not found"})
    }
  })
  .catch(error => {
    res.status(500).json(error);
  })
});

router.delete('/:id', (req, res) => {
  // remove roles (inactivate the role)
  db('roles')
    .where( { id: req.params.id})
    .del()
    .then( roles => res.status(204).end())
    .catch(error => res.status(500).json(error))
});

module.exports = router;
