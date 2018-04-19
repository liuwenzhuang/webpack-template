import _ from 'lodash';
import { print } from './print';
import style from './style.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('service worker installed'))
    .catch(err => console.error('Error', err));
  });
}

function component() {
    var element = document.createElement('div');
    element.innerHTML = _.join(['hello', 'webpack', 'demo'], ' ');
    element.classList.add(style.hello);

    return element;
}

document.body.appendChild(component());

print();
console.log('index done');
