import Benchmark from 'benchmark';
import { wordleFeedback } from '../WordleCruncher/Feedback'

const suite = new Benchmark.Suite();

const guess = 'ÆØÅAA';
const secret = 'AAÆØÅ';

suite
  .add('wordleFeedback', function () {
    wordleFeedback(guess, secret);
  })
  .on('cycle', function (event: any) {
    console.log(String(event.target));
  })
  .on('complete', function (this: Benchmark.Suite) {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });