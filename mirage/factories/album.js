import { Factory } from 'miragejs';

export default Factory.extend({
  title(i) {
    return `Album ${i}`;
  },
  cover() {
    return 'https://www.placeholder.com/300';
  },
  releasedate() {
    return new Date('2020-01-01');
  },
  genre() {
    return 'Rock';
  },
  averagerating() {
    return 4.5;
  },
});
