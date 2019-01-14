module.exports = {
    env: "dev",
    port: 8100,
    chatport:8200,
    database: "mongodb://artist-link-test:artist-link-test123@ds149724.mlab.com:49724/artist-link-test",
    smtp : {
        smtp_host: "smtp.gmail.com",
        smtp_user: "vishal.test123456@gmail.com",
        smtp_password: "vishal987654",
        frommail: '"xxx - xx "<vishal.test123456@gmail.com>',
        title: "ManaB APP : ",
        mailadmin: 'vishal.test123456@gmail.com'
    },
    // smtp : {
    //     smtp_host: "smtp.gmail.com",
    //     smtp_user: "prakhar.gautam@ithours.com",
    //     smtp_password: "p952849965",
    //     frommail: '"ManaB - Admin "<prakhar.gautam@ithours.com>',
    //     title: "ManaB APP : ",
    //     mailadmin: 'prakhar.gautam@ithours.com'
    // },
    // bar_admin_url:"http://localhost:4200/",
    secret:'supersecret'
}







