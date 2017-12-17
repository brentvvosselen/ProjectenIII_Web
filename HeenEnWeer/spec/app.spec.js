let Request = require('request');
let token = {};
let id = {};

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

    describe("GET /api/parents/:email",() => {
        let data = {};
        beforeAll((done) => {
            Request({
                method: 'GET',
                uri: 'http://localhost:5000/api/parents/jess@aarschot.be',
                json: true,
            },(error, response, body) => {
                data.status = response.statusCode;
                data._id = response.body._id;
                id = data._id;
                done();
            }).auth(null,null,true,token);;
        });

        it("status 200", () => {
            expect(data.status).toBe(200);
        });

        it("parent not empty",() => {
            expect(data._id).toBeDefined();
        });
    });

    describe("GET /api/parents/:email",() => {
        let data = {};
        beforeAll((done) => {
            Request({
                method: 'GET',
                uri: 'http://localhost:5000/api/parents/jessica@aarschot.be',
                json: true,
            },(error, response, body) => {
                data.status = response.statusCode;
                data.body = response.body;
                done();
            }).auth(null,null,true,token);;
        });

        it("status 200", () => {
            expect(data.status).toBe(200);
        });

        it("parent is empty",() => {
            expect(data.body).toBeNull();
        });
    });

    describe("POST /api/child/:id",() => {
        let data = {};
        beforeAll((done) => {
            Request({
                method: 'POST',
                uri: 'http://localhost:5000/api/child/' + id,
                json: true,
                body: {
                    firstname: "ella",
                    lastname: "aarschot",
                    gender: "F",
                    birthdate: new Date()
                }
            },(error, response, body) => {
                data.status = response.statusCode;
                data.body = response.body;
                done();
            }).auth(null,null,true,token);;
        });

        it("status 200", () => {
            expect(data.status).toBe(200);
        });

        it("child is not empty",() => {
            expect(data.body._id).toBeDefined();
        });

        it("check recipe body", () => {
            expect(data.body.firstname).toBe("ella");
            expect(data.body.lastname).toBe("aarschot");
            expect(data.body.gender).toBe("F");
            _id = data.body._id;
        });
    });