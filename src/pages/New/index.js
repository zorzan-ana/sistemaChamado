import { useState, useContext, useEffect } from "react"

import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiPlusCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { db } from "../../services/firebaseConnection"
import { collection, getDocs, getDoc, doc, query, addDoc, updateDoc } from "firebase/firestore"
import { useParams, useNavigate } from "react-router-dom"

import { AuthContext } from "../../contexts/auth"


import './new.css'

const listaRef = collection(db, "customers")

export default function New() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([])
  const [loadCustomer, setLoadCustomer] = useState(true);
  const [custumerSelected, setCustumerSelected] = useState(0)
  const [idCustomers, setIdCustomers] = useState(false);

  const [complemento, setComplemento] = useState('')
  const [assunto, setAssunto] = useState('Suporte')
  const [status, setStatus] = useState('Aberto')

  useEffect(() => {
    async function loadCustomer() {
      const querySnapshot = await getDocs(listaRef)
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia
            })
          })
          if (snapshot.docs.size === 0) {
            setCustomers([{ id: 1, nomeFantasia: "FREELA" }])
            setLoadCustomer(false);
            return;
          }
          setCustomers(lista);
          setLoadCustomer(false);

          if (id) {
            loadId(lista);
          }

        })
        .catch((error) => {
          setLoadCustomer(false);
          setCustomers([{ id: 1, nomeFantasia: "FREELA" }])
        })
    }
    loadCustomer();
  }, [id])

  async function loadId(lista) {
    const docRef = doc(db, "chamados", id);
    await getDoc(docRef)

      .then((snapshot) => {
        setAssunto(snapshot.data().assunto)
        setStatus(snapshot.data().status)
        setComplemento(snapshot.data().complemento)

        let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
        setCustumerSelected(index);
        setIdCustomers(true)

      })
      .catch((error) => {
        toast.error("Chamado não encontrado!")
        setIdCustomers(false);
      })
      .catch(() => {
        toast.error("Ops! Erro ao atulizar chamado!")
      })


  }

  function handleOptionsChange(e) {
    setStatus(e.target.value);
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value);
  }

  function handleChangeCustomer(e) {
    setCustumerSelected(e.target.value);
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (idCustomers) {
      const docRef = doc(db, "chamados", id);
      await updateDoc(docRef, {
        cliente: customers[custumerSelected].nomeFantasia,
        clienteId: customers[custumerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid
      })
        .then(() => {
          toast.info("Chamado atualizado com sucesso!")
          setCustumerSelected(0);
          setComplemento('');
          navigate('/dashboard')


        })
      return;
    }

    await addDoc(collection(db, "chamados"), {
      created: new Date(),
      cliente: customers[custumerSelected].nomeFantasia,
      clienteId: customers[custumerSelected].id,
      assunto: assunto,
      complemento: complemento,
      status: status,
      userId: user.uid
    })
      .then(() => {
        toast.success("Chamado resgitrado com sucesso!")
        setComplemento('')
        setCustumerSelected(0)
      })
      .catch(() => {
        toast.error("Ops! Erro ao registrar chamado!")

      })

  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name={id ? "Editando chamado" : "Novo chamado"}>
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Clientes</label>
            {
              loadCustomer ? (
                <input type="text" disabled={true} value={"Carregando..."} />
              ) : (
                <select value={custumerSelected} onChange={handleChangeCustomer}>
                  {customers.map((item, index) => {
                    return (
                      <option key={index} value={index}>
                        {item.nomeFantasia}

                      </option>

                    )


                  })}

                </select>
              )
            }


            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionsChange}
                checked={status === "Aberto"}

              />
              <span>Em Aberto</span>

              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionsChange}
                checked={status === "Progresso"}

              />
              <span>Em progresso</span>

              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionsChange}
                checked={status === "Atendido"}

              />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva melhor seu problema (opcional)."
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />

            <button type="submit">Registrar</button>

          </form>
        </div>
      </div>
    </div>
  )
}