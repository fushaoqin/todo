const { admin, db } = require('../util/admin');
const config = require('../util/config');

const firebase = require('firebase');

firebase.initializeApp(config);

const { validateLoginData, validateSignUpData } = require('../util/validators');

exports.loginUser = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    const { valid, errors } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
            const user = userCredential.user;
            return user.getIdToken();
        })
        .then((token) => {
            return res.json({ token })
        })
        .catch((err) => {
            console.error(err);
            return res.status(403).json({ general: err.message });
        });
};

exports.signUpUser = (req, res) => {
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        country: req.body.country,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        username: req.body.username
    }

    const { valid, errors } = validateSignUpData(newUser);
    if (!valid) return res.status(400).json(errors);

    let token, userId;

    db.collection('users').doc(`${newUser.username}`).get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(400).json({ username: "this username is already taken" });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
                    .then((userCredential) => {
                        userId = userCredential.user.uid;
                        return userCredential.user.getIdToken();
                    })
                    .then((idtoken) => {
                        token = idtoken;
                        const userInfo = {
                            firstName: newUser.firstName,
                            lastName: newUser.lastName,
                            email: newUser.email,
                            phoneNumber: newUser.phoneNumber,
                            country: newUser.country,
                            username: newUser.username,
                            createdAt: new Date().toISOString(),
                            userId
                        };
                        return db.collection('users').doc(`${newUser.username}`).set(userInfo);
                    })
                    .then(() => {
                        return res.status(201).json({ token });
                    })
                    .catch((err) => {
                        console.error(err);
                        if (err.code === 'auth/email-already-in-use') {
                            return res.status(400).json({ email: 'email already in use' });
                        } else {
                            return res.status(500).json({ general: err.message });
                        }
                    });
            }
        })
        //     }
        // })
        // .then((data) => {
        //     userId = data.user.uid;
        //     console.log(data.user.getIdToken());
        //     return data.user.getIdToken();
        // })
        // .then((token) => {
        //     userToken = token;
        //     const userInfo = {
        //         firstName: newUser.firstName,
        //         lastName: newUser.lastName,
        //         email: newUser.email,
        //         phoneNumber: newUser.phoneNumber,
        //         country: newUser.country,
        //         username: newUser.username,
        //         createdAt: new Date().toISOString(),
        //         userId
        //     };
        //     return db.collection('users').doc(`${newUser.username}`).set(userInfo);
        // })
        // .then(() => {
        //     console.log(userToken);
        //     return res.status(201).json({ userToken });
        // })
        // .catch((err) => {
        //     console.error(err);
        //     if (err.code === 'auth/email-already-in-use') {
        //         return res.status(400).json({ email: 'email already in use' });
        //     } else {
        //         return res.status(500).json({ general: `${err.message}`});
        //     }
        // });
};

deleteImage = (imageName) => {
    const bucket = admin.storage().bucket();
    const path = `${imageName}`
    return bucket.file(path).delete()
        .then(() => {
            return 
        })
        .catch((err) => {
            return
        })
}

exports.uploadProfilePhoto = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    const busboy = new BusBoy({ headers: req.headers });

    let imageFileName;
    let imageUpload = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
            return res.status(400).json({ error: 'Wrong file type submited' });
        }

        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${req.user.username}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageUpload = { filePath, mimetype };
        file.pipe(fs.createWriteStream(filePath));
    });

    deleteImage(imageFileName);
    
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageUpload.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageUpload.mimetype
                }
            }
        })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                return db.doc(`/users/${req.user.username}`).update({ imageUrl });
            })
            .then(() => {
                return res.json({ message: 'Image uploaded successfully' });
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({ err: err.code });
            });
    });
    busboy.end(req.rawBody);
}

exports.getUserDetail = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.username}`).get()
        .then((doc) => {
            if (doc.exists) {
                userData.userCredentials = doc.data();
                return res.json(userData);
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

exports.updateUserDetails = (req, res) => {
    let document = db.collection('users').doc(`${req.user.username}`);
    document.update(req.body)
        .then(() => {
            res.json({ message: 'Updated successfully' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ message: 'Cannot update the value' });
        });
};