const Product = require('../models/product');
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: 'admin/add-product',
    editing : false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  console.log(title,price,imageUrl,description)
  const product = new Product(title, price, description, imageUrl, null, req.user._id)
  product
    .save()
    .then(result => {
      console.log('Product Created')
      res.redirect('/admin/products')
    })
    .catch(err => { 
      console.log(err)
    })
};  

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findById(prodId)

  .then(product => {
    if (!product) {
      return res.redirect('/')
    }
  
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
  });
  })
  .catch(err => console.log(err))
}

exports.postEditProduct = (req,res,next) => {
  const prodID = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedImageUrl = req.body.imageUrl
  const updatedDesc = req.body.description
  
  const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, new ObjectId(prodID))
  product
  .save()
  .then(result => {
    console.log('Updated Product')
    res.redirect('/admin/products')
  })
  .catch(err => console.log(err))
  
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products ,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      })
    })
    .catch(err => console.log(err))
};

exports.postDeleteProduct = (req, res, next) => {
  const prodID = req.body.productId
  Product.deleteById(prodID)
  .then(result => {
    console.log('Destroyed Product')
    res.redirect('/admin/products')
  })
  .catch(err => console.log(err))
}