import React, { useState, useEffect } from 'react';
import * as yup from "yup";
import axios from "axios";

export default function Form() {

    // react state
    const formSubmit = e => {
        e.preventDefault();
        console.log("form submitted!");

        axios
            .post("https://reqres.in/api/users", formState)
            .then(({ data }) => {
                setUsers([...users, data]);
            })
            .catch(err => console.log(err));
    }

    const defaultState = {
        name: "",
        email: "",
        password: "",
        terms: false
    };

    let formSchema = yup.object().shape({
        name: yup.string()
            .required("Please provide name."),
        email: yup
            .string()
            .required("Please provide a email.")
            .email("This is not a valid email."),
        password: yup
            .string()
            .required("Please create a password.")
            .min(6, "Password must be at least 6 characters long"),
        terms: yup
            .boolean()
            .oneOf([true], "Please agree to the terms and conditions")
    });

    const [formState, setFormState] = useState(defaultState);
    const [errors, setErrors] = useState({ ...defaultState, terms: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        formSchema.isValid(formState).then(valid => console.log('valid?', valid));
        if (formState.terms) {
            setButtonDisabled(!formState.terms);
        }
    }, [formState]);

    // onChange function
    const inputChange = e => {
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormState({
            ...formState,
            [e.target.name]: value
        });
        validateChange(e);
    };

    //validate
    const validateChange = e => {
        e.persist();
        yup
            .reach(formSchema, e.target.name)
            .validate(e.target.value)
            .then(valid =>
                setErrors({
                    ...errors,
                    [e.target.name]: ""
                })
            )
            .catch(error =>
                setErrors({
                    ...errors,
                    [e.target.name]: error.errors[0]
                })
            );
        if (e.target.value.length === 0) {
            setErrors({
                ...errors,
                [e.target.name]: `${e.target.name} field is required`
            });
        }
    };

    return (
        <div>
            <form onSubmit={formSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={inputChange}
                    label="Name"
                />
                {errors.name && <p className="error">{errors.name}</p>}
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={inputChange}
                    label="Email"
                    errors={errors}
                />
                {errors.email && <p className="error">{errors.email}</p>}
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formState.password}
                    onChange={inputChange}
                    label="Password"
                />
                {errors.password && <p className="error">{errors.password}</p>}
                <label className="terms" htmlFor="terms">
                    <input name="terms" type="checkbox" value={true} onChange={inputChange} />
                Terms and Conditions
                {errors.terms && <p className="error">{errors.terms}</p>}
                </label>
                <button disabled={buttonDisabled}>Submit</button>
            </form>
            <div className="users">
                <h2>Users</h2>
                <div className="list">
                    {users.map(user => {
                        return (
                            <div className="user">
                                <p className="name">{user.name}</p>
                                <small className="email">{user.email}</small>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );

}

