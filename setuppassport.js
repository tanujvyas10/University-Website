const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { Users } = require('./db')

passport.use('users', new LocalStrategy((username, password, done) => {
    Users.findOne({
      where: {
        username,
      }
    })
      .then((user) => {
        if (!user) {
          return done(new Error('Username invalid'))
        }

        if (user.password != password) {
          return done(null, false)
        }

        done(null, user)
      })
      .catch(done)
  })
)

// passport.use('admins', new LocalStrategy((username, password, done) => {
//   Admins.findOne({
//     where: {
//       username,
//     }
//   })
//     .then((admin) => {
//       if (!admin) {
//         return done(new Error('Username invalid'))
//       }

//       if (admin.password != password) {
//         return done(null, false)
//       }

//       done(null, admin)
//     })
//     .catch(done)
// })
// )

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((userId, done) => {
  Users.findOne({
    where: {
      id: userId
    }
  })
    .then((user) => done(null, user))
    .catch(done)
})

module.exports = passport