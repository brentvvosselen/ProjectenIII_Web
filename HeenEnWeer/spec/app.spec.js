let Request = require('request');


    //right login gets token and status 200
    describe("POST /api/login",() => {
        let data = {};
        beforeAll((done)=> {
            Request({
                method: 'POST',
                uri: 'http://localhost:5000/api/login',
                json: true,
                body: {"email":"jess@aarschot.be","password":"test"} 
            },(error, response, body) => {
                data.status = response.statusCode;
                data.token = response.body.token;
                token = data.token;
                done();
            });
        });
        
        it("status 200", () => {
            expect(data.status).toBe(200);
        });

        it("token not empty",() => {
            expect(data.token).toBeDefined();
        });
    });

    describe("POST /api/login",() => {
        let data = {};
        beforeAll((done) => {
            Request({
                method: 'POST',
                uri: 'http://localhost:5000/api/login',
                json: true,
                body: {"email":"erik@test.be","password":"teste"}
            },(error, response, body) => {
                data.status = response.statusCode;
                data.token = response.body.token;
                done();
            });
        });

        it("status 500", () => {
            expect(data.status).toBe(500);
        });

        it("token empty",() => {
            expect(data.token).toBeUndefined();
        });
    });