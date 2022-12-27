/* eslint-disable space-before-function-paren */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */

const Hapi = require("@hapi/hapi");
const routes = require("./routes");

const init = async() => {
    const server = Hapi.server({
        port: 5000,
        host: process.env.NODE_ENV !== "production" ? "localhost" : '0.0.0.0',
        routes: {
            cors: {
                origin: ["*"],
            },
        },
    });
    server.route(routes);

    try {
        await server.start();
        console.log(`Server berjalan pada ${server.info.uri}`);
    } catch (error) {
        console.log(error)
    }

};

init();