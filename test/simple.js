process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);


describe('Laberinto', () => {
  describe('GET /', () => {
      it('it should GET the homepage', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });
  });

  // describe('GET /locations', () => {
  //     it('should GET the locations page if authed else redirect to page', (done) => {
  //       chai.request(server)
  //           .get('/locations')
  //           .end((err, res) => {
  //               res.should.have.status(200);
  //             done();
  //           });
  //     });
  // });
});
