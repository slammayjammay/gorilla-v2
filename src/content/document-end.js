const gorilla = document.createElement('div');
gorilla.id = 'gorilla';
document.body.prepend(gorilla);

require('./helpers/run-user-scripts')('document-end');
