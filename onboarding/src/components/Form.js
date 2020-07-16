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
            .then(() => console.log("form submitted success"))
            .catch(err => console.log(err));
    }

    const defaultState = {
        name: "",
        email: "",
        
        terms: false
    };

    let formSchema = yup.object().shape({
        name: yup.string().required("Please provide name."),
        email: yup
            .string()
            .required("Please provide a email.")
            .email("This is not a valid email."),
        motivation: yup
            .string()
            .required("Please state why you are interested in volunteering."),
        position: yup.string(),
        terms: yup
            .boolean()
            .oneOf([true], "Please agree to the terms and conditions")
    });
    
    const [formState, setFormState] = useState(defaultState);
    const [errors, setErrors] = useState({ ...defaultState, terms: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    
    useEffect(() => {
        if (formState.terms) {
            setButtonDisabled(!formState.terms);
        }
    }, [formState]);

    //validate
    const validateChange = e => {
        e.persist();
        if (e.target.value.length === 0) {
            setErrors({
                ...errors,
                [e.target.name]: `${e.target.name} field is required`
            });
        }
    };

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

    return (
        <form onSubmit={formSubmit}>
            <label>Name</label>
            <input
                type="text"
                name="name"
                value={formState.name}
                onChange={inputChange}
                label="Name"
            />
            <label>Email</label>
            <input
                type="email"
                name="email"
                value={formState.email}
                onChange={inputChange}
                label="Email"
                errors={errors}
            />
            <label>Password</label>
            <input
                type="password"
                name="motivation"
                onChange={inputChange}
                label="Password"
            />

            <label className="terms" htmlFor="terms">
                <input name="terms" type="checkbox" />
                Terms and Conditions
            </label>
            <button disabled={buttonDisabled}>Submit</button>
        </form>
    );

}

