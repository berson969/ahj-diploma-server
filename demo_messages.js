const {faker} = require("@faker-js/faker");


const messages = [...Array(100)].map(() => {
    const messageType = ['text', 'image'][Math.floor(Math.random() * 2)];
    const href =  (Math.random() < 0.5) ? faker.internet.url() : "";

    return {
        id: faker.string.uuid(),
        from: faker.person.lastName(),
        type: messageType,
        textBody: messageType + " "
            + ((href) ? `<a href=${href}>${href}</a>` : "") + " "
            + faker.lorem.words(2),
        blobContent: (messageType === 'image') ? faker.image.dataUri() : "",
        receivedAt: faker.date.between({
            from: "2020-01-01T00:00:00.000Z",
            to: Date.now(),
        })
    }
});

const videoMessage = {
        id: "2ae80f55-a398-4d97-aa0a-3614260b2aa6",
        from: "232646b1-c0e9-4773-91b1-ba92734180af",
        type: "video",
        receivedAt: faker.date.between({
            from: "2020-01-01T00:00:00.000Z",
            to: Date.now(),
        }),
        textBody: "video 201242 (360p).mp4",
    };
messages.push(videoMessage);

const audioMessage = {
    from: "232646b1-c0e9-4773-91b1-ba92734180af",
    id: "3d09f90f-4dae-4562-a187-672b7dbe2746",
    receivedAt: new Date("2024-02-29T09:09:59.606Z"),
    textBody: "audio Alex Alta - Bandits.mp3",
    type: "audio",
};
messages.push(audioMessage);

const  geoMessage1 = {
    blobContent: "",
    from: "232646b1-c0e9-4773-91b1-ba92734180af",
    id: "897a4e18-f92b-41bf-b75b-5bd97e823bbf",
    receivedAt: faker.date.between({
        from: "2020-01-01T00:00:00.000Z",
        to: Date.now(),
    }),
    textBody: "5.353238274383567 : -4.000367922467136",
    type: "geo"
};
messages.push(geoMessage1);
const  geoMessage2 = {
    blobContent: "",
    from: "232646b1-c0e9-4773-91b1-ba92734180af",
    id: "897a4e18-f32b-41bf-b75b-5bd97e823bbf",
    receivedAt: faker.date.between({
        from: "2020-01-01T00:00:00.000Z",
        to: Date.now(),
    }),
    textBody: "42.67275228796623 : -84.53983610206824",
    type: "geo"
};
messages.push(geoMessage2);

module.exports = messages;
