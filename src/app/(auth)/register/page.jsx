"use client"
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Input from "@/components/Input"
import Button from "@/components/Button"
import Link from "next/link";
import * as Yup from 'yup'
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Register = () =>{

    const [error, setError] = useState("");
    const [isFormSubmitting, setFormSubmitting] = useState(false);
    const router = useRouter();
    const status = useSession();

    // verifica se seta logado, se estiver... envia para setada
    useEffect(() => {
        if (status === "authenticated") {
          router.push("/");
        }
      }, [status, router]);
    
      if (status !== "unauthenticated") {
        return null;
    }

    const initialValues = {
        name: "",
        email: "",
        password: "",
    };
    
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("O campo nome é obrigatório"),
        email: Yup.string()
            .email("Digite um e-mail válido")
            .required("O campo e-mail é obrigatório"),
        password: Yup.string().required("O campo senha é obrigatório"),
    });


    const handleSubmit = async (values, {resetForm}) => {
        setFormSubmitting(true);
        try {
            await fetch("/api/auth/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: values.name,
                email: values.email,
                password: values.password,
              }),
            }).then(async (res) => {
              const result = await res.json();
      
              if (result.status === 201) {
                alert(result.message);
                router.push("/login");
              } else {
                renderError(result.message);
                resetForm();
              }

              setFormSubmitting(false);
            });
          } catch {
            setFormSubmitting(false);
            renderError("Erro ao criar conta, tente mais tarde!");
          }
    };

    const renderError = (msg) => {
        setError(msg);
        setTimeout(()=>{
            setError("");
        }, 3000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {
                    ({values}) =>(
                        <Form noValidate className="flex flex-col gap-2 p-4 border rounded border-zinc-300 min-w-[300px] bg-white"> 
                            <Input name='name' required/>
                            <Input name='email' type="email" required/>
                            <Input name='password' type="password" required autoComplete="off"/>
                            <Button type="submit" 
                                text={isFormSubmitting ? "Carregando..." : "Inscrever-se"} 
                                disabled={isFormSubmitting}
                                className="bg-green-500 text-white rounded p-2 cursor-pointer"
                            />
                            {!values.name && !values.email && !values.password && error && (
                                <span className="text-red-500 text-sm text-center">{error}</span>
                            )}
                            <span className="text-xs text-zinc-500">
                                Possui uma conta? 
                                <strong className="text-zinc-700">
                                    <Link href="/login"> Logar</Link>
                                </strong>
                            </span>
                        </Form>
                    )
                }
            </Formik>
        </div>
    )
}

export default Register;