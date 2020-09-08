const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});

const Cat = mongoose.model('Cow', { name: String });

const kitty = new Cat({ name: 'Zildjian11' });
kitty.save().then(() => console.log('meow'));

const kitty1 = new Cat({ name: 'Zildjian 11221' });
kitty1.save().then(() => console.log('meow'));
