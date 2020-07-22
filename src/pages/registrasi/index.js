import React, { useState } from 'react'

// import material-ui
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';

// import styles
import useStyles from './styles';
// react router-dom
import { Link, Redirect } from 'react-router-dom'
// validasi
import isEmail from 'validator/lib/isEmail';
// firebase hook
import { useFirebase } from '../../components/FirebaseProvider';
// loading
import AppLoading from '../../components/AppLoading'


export default function Registrasi () {
    const classes = useStyles();

    // form
    const [form, setForm] = useState({
        email: '',
        password: '',
        konfirmasi_password: ''
    });

    // error
    const [error, setError] = useState({
        email: '',
        password: '',
        konfirmasi_password: ''
    })

    const [isSubmiting, setSubmitting] = useState(false)

    // auth firebase
    const { auth, user, loading } = useFirebase();

    // handle form
    const handleChange = e => {

        // change form
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        // change error
        setError({
            ...error,
            [e.target.name]: '',
            [e.target.password]: '',
            [e.target.konfirmasi_password]: '',
        });
    }

    // form validasi
    const validate = () => {
        const newError = { ...error };

        if (!form.email) {
            newError.email = 'Email wajib diisi';
        } else if (!isEmail(form.email)) {
            newError.email = 'Email tidak valide';
        }

        if (!form.password) {
            newError.password = 'Password wajib diisi';
        }

        if (!form.konfirmasi_password) {
            newError.konfirmasi_password = 'Konfirmasi Password wajib diisi';
        } else if (form.konfirmasi_password !== form.password) {
            newError.konfirmasi_password = "Konfirmasi Password tidak sama dengan password";
        }

        return newError;
    }

    // handle submit
    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {
            try {
                setSubmitting(true);
                await auth.createUserWithEmailAndPassword(form.email, form.password)
            } catch (e) {
                const newError = {};


                switch (e.code) {
                    case 'auth/email-already-in-use':
                        newError.email = 'Email sudah terdaftar'
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email tidak valid'
                        break;
                    case 'auth/weak-password':
                        newError.password = 'Password lemah'
                        break;
                    case 'auth/operation-not-allowed':
                        newError.email = 'Metode email dan password tidak didukung'
                        break;
                    default:
                        newError.email = 'Terjadi kesalahan jaringan silahkan coba lagi'
                        break;
                }
                setError(newError);
                setSubmitting(false);
            }
        }
    }

    if (loading) {
        return <AppLoading />
    }
    if (user) {
        return <Redirect to="/" />
    }

    return <Container maxWidth="xs">
        <Paper className={classes.paper}>
            <Typography
                variant="h5"
                component="h1"
                className={classes.title}>Buat Akun Baru</Typography>
            <form onSubmit={handleSubmit} noValidate>
                <TextField id="email"
                    type="email"
                    name="email"
                    margin="normal"
                    label="Alamat Email"
                    fullWidth
                    required
                    value={form.email}
                    onChange={handleChange}
                    helperText={error.email}
                    error={error.email ? true : false}
                    disabled={isSubmiting}
                />
                <TextField id="password"
                    type="password"
                    name="password"
                    margin="normal"
                    label="Password"
                    fullWidth
                    required
                    value={form.password}
                    onChange={handleChange}
                    helperText={error.password}
                    error={error.password ? true : false}
                    disabled={isSubmiting}
                />
                <TextField id="konfirmasi_password"
                    type="password"
                    name="konfirmasi_password"
                    margin="normal"
                    label="Konfirmasi Password"
                    fullWidth
                    required
                    value={form.konfirmasi_password}
                    onChange={handleChange}
                    helperText={error.konfirmasi_password}
                    error={error.konfirmasi_password ? true : false}
                    disabled={isSubmiting}
                />
                <Grid container className={classes.buttons}>
                    <Grid item xs>
                        <Button type="submit" color="primary" variant="contained" size="large" disabled={isSubmiting}>Daftar</Button>
                    </Grid>
                    <Grid item>
                        <Button disabled={isSubmiting} component={Link} variant="contained" size="large" to="/login">Login</Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
}

