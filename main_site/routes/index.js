var express = require('express');
var router = express.Router();
var Inventory = require('../models/inventory');
var News = require('../models/news');
var Projects = require('../models/projects');

var async = require('async');


/* GET home page. */
router.get('/', function (req, res, next) {
  async.parallel({
    inventory: function (callback) {
      Inventory.find({}, callback);
    },
    projects: function (callback) {
      Projects.find({}, callback);
    },
    news: function (callback) {
      News.find({}, callback);
    }
  }, function (err, results) {
    console.log(results);
    res.render('index', { news: results['news'], inventory: results['inventory'], projects: results['projects'] });
  });
});

//--------club inventory page----------
router.get('/inventory', function (req, res, next) {
  Inventory.find({}).select('-_id').exec(function (err, result) {
    console.log(result);
    res.render('inventory_2', { array: result });
  });
});


//-----notifications page---------
router.get('/notifications', function (req, res, next) {
  News.find({}).select('-_id').exec(function (err, result) {
    console.log(result);
    res.render('notifications', { data: result });
  });
});


//---------projects page --------------
router.get('/projects', function (req, res, next) {
  Projects.find({}).select('-id').exec(function (err, result) {
    console.log(result);
    res.render('projects', { data: result });
  });
});


//---------admin page-----------
router.get('/admin', function (req, res, next) {
  async.parallel({
    inventory: function (callback) {
      Inventory.find({}, callback);
    },
    projects: function (callback) {
      Projects.find({}, callback);
    },
    news: function (callback) {
      News.find({}, callback);
    }
  }, function (err, results) {
    res.render('admin', { news: results['news'], inventory: results['inventory'], projects: results['projects'] });
  });
});

//----------inventory forms-----------
router.get('/inventory/create', function (req, res, next) {
  res.render('inventory_form', { action: "Create", results: 0, del: 0 })
})

router.post('/inventory/create', function (req, res, next) {
  var component = new Inventory(
    {
      name: req.body.name,
      total: req.body.total,
      available: req.body.available,
      price: req.body.price
    }
  );
  component.save(function (err) {
    if (err) { return next(err); }
    res.redirect('../admin');
  })
})

router.get('/inventory/:id/delete', function (req, res, next) {
  var id = req.params.id;
  Inventory.find({ _id: id }).exec(function (err, results) {
    console.log(results);
    res.render('inventory_form', { action: "Delete", results: results, del: 1 });
  });
})

router.post('/inventory/:id/delete', function (req, res, next) {
  Inventory.findByIdAndRemove(req.params.id, function deleteComponent(err) {
    if (err) { return next(err); }
    // Success - go to author list
    res.redirect('../../admin')
  });
})

router.get('/inventory/:id/update', function (req, res, next) {
  var id = req.params.id;
  Inventory.find({ _id: id }).exec(function (err, results) {
    console.log(results);
    res.render('inventory_form', { action: "Update", results: results, del: 0 });
  });
})

router.post('/inventory/:id/update', function (req, res, next) {
  var component = new Inventory(
    {
      name: req.body.name,
      total: req.body.total,
      available: req.body.available,
      price: req.body.price,
      _id: req.params.id
    }
  );
  Inventory.findByIdAndUpdate(req.params.id, component, {}, function (err, thecomponent) {
    if (err) { return next(err); }
    res.redirect('../../admin');
  });
});


//----------news forms-----------
router.get('/news/create', function (req, res, next) {
  res.render('news_form', { action: "Create", results: 0, del: 0 })
})

router.post('/news/create', function (req, res, next) {
  var component = new News(
    {
      title: req.body.title,
      content: req.body.content,
      date_created: req.body.date_created
     
    }
  );
  component.save(function (err) {
    if (err) { return next(err); }
    res.redirect('../admin');
  })
})

router.get('/news/:id/delete', function (req, res, next) {
  var id = req.params.id;
  News.find({ _id: id }).exec(function (err, results) {
    console.log(results);
    res.render('news_form', { action: "Delete", results: results, del: 1 });
  });
})

router.post('/news/:id/delete', function (req, res, next) {
  News.findByIdAndRemove(req.params.id, function deleteComponent(err) {
    if (err) { return next(err); }
    // Success - go to author list
    res.redirect('../../admin')
  });
})

router.get('/news/:id/update', function (req, res, next) {
  var id = req.params.id;
  News.find({ _id: id }).exec(function (err, results) {
    console.log(results);
    res.render('news_form', { action: "Update", results: results, del: 0 });
  });
})

router.post('/news/:id/update', function (req, res, next) {
  var component = new News(
    {
      title: req.body.title,
      content: req.body.content,
      date_created: req.body.date_created,
      _id: req.params.id
    }
  );
  News.findByIdAndUpdate(req.params.id, component, {}, function (err, thecomponent) {
    if (err) { return next(err); }
    res.redirect('../../admin');
  });
});

//----------projects forms-----------
router.get('/projects/create', function (req, res, next) {
  res.render('projects_form', { action: "Create", results: 0, del: 0 })
})

router.post('/projects/create', function (req, res, next) {
  var component = new Projects(
    {
      name: req.body.name,
      description:req.body.description,
      mentor: req.body.mentor,
      team:req.body.team,
      
      date_of_creation:req.body.date_of_creation
     
    }
  );
  component.save(function (err) {
    if (err) { return next(err); }
    res.redirect('../admin');
  })
})

router.get('/projects/:id/delete', function (req, res, next) {
  var id = req.params.id;
  Projects.find({ _id: id }).exec(function (err, results) {
    console.log(results);
    res.render('projects_form', { action: "Delete", results: results, del: 1 });
  });
})

router.post('/projects/:id/delete', function (req, res, next) {
  Projects.findByIdAndRemove(req.params.id, function deleteComponent(err) {
    if (err) { return next(err); }
    // Success - go to author list
    res.redirect('../../admin')
  });
})

router.get('/projects/:id/update', function (req, res, next) {
  var id = req.params.id;
  Projects.find({ _id: id }).exec(function (err, results) {
    console.log(results);
    res.render('projects_form', { action: "Update", results: results, del: 0 });
  });
})

router.post('/projects/:id/update', function (req, res, next) {
  var component = new Projects(
    {
      name: req.body.name,
      description:req.body.description,
      mentor: req.body.mentor,
      team:req.body.team,
      
      date_of_creation:req.body.date_of_creation,
      _id: req.params.id
    }
  );
  Projects.findByIdAndUpdate(req.params.id, component, {}, function (err, thecomponent) {
    if (err) { return next(err); }
    res.redirect('../../admin');
  });
});

/* -------- REST APIs -------- */
// Status is Ok for both errors and successful, check at the client side for this
// -------- Important ---------
// Response: { status : 1 or 0 ) 1 implies success 

/**
 * Rest Api to view the items present in inventory
 */
router.get('/api/inventory', function (req, res, next) {
  Inventory.find({}).select('-_id').exec(function (err, result) {
    console.log(result);
    res.json(result);
  });
});

/**
 * API to Add an item in inventory
 * 
 * Example to be sent request body in json
 * {
 *    "name" : "nodemcu",
 *    "total" : "9",
 *    "available" : "6",
 *    "price" : "290"
 * }
 * 
 */
router.post('/api/inventory/create', function (req, res, next) {
  var component = new Inventory(
    {
      name: req.body.name,
      total: req.body.total,
      available: req.body.available,
      price: req.body.price
    }
  );
  component.save(function (err) {
    if (err) { 
      // Only passing the error message in the response
      res.json({ status : 0, msg : err.message});
     }
    res.json({ status : 1, msg : "successfully added!"});
  });
});

/**
 * Rest Api to delete an inventory value using the id
 * send the id in the body in the form of json
 */
router.post('/api/inventory/delete', function (req, res, next) {
  // getting the Id
  Inventory.findByIdAndRemove(req.body.id, function deleteComponent(err) {
    if (err) { res.json({ status : 0, msg : err.message}); }
    // Success - go to author list
    res.json({ status : 1, msg : "successfully deleted!"});
  });
})

/**
 * Rest Api to update an inventory
 * Send the id, name, total, available, price in json form (Five things)
 */
router.post('/api/inventory/update', function (req, res, next) {
  var component = new Inventory(
    {
      name: req.body.name,
      total: req.body.total,
      available: req.body.available,
      price: req.body.price,
      _id: req.params.id
    }
  );
  Inventory.findByIdAndUpdate(req.body.id, component, {}, function (err, thecomponent) {
    if (err) { res.json({ status : 0, msg : err.message}); }
    res.json({ status : 1, msg : "successfully updated!"});
  });
});



module.exports = router;
