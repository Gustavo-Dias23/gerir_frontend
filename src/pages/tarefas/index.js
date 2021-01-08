import React, { useState, useEffect } from 'react';
import {Container, Card, Form, Table, Button, InputGroup} from'react-bootstrap';


const Tarefas = () => {
    const [id, setId] = useState(0);
    const [titulo, setTitulo] = useState ('');
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState('');
    const [dataEntrega, setdataEntrega] = useState('');
    const [status, setStatus] = useState(false);
    const [tarefas, setTarefas] = useState([]);

    useEffect(() => {
        listarTarefas ();
    },[])
    
    const listarTarefas = () =>{
        fetch('http://localhost:63095/api/tarefa',{
            method : 'Get',
            headers : {
                'authorization' : 'Bearer ' + localStorage.getItem('token-gerir')
            }
        })
            .then(response => response.json())
            .then(data => {
                setTarefas(data.data);
            })
    }
    const salvar =(event) => {
        event.preventDefault();

        const tarefa = {
            titulo : titulo,
            descricao : descricao,
            categoria : categoria,
            DataEntrega : dataEntrega
        }

        // tarefa.status = 1;



        const method = (id === 0 ? 'POST' : 'PUT');
        const urlRequest = (id === 0 ? 'http://localhost:63095/api/tarefa' : 'http://localhost:63095/api/tarefa/' +id       )

        fetch(urlRequest, {
            method : method,
            body : JSON.stringify(tarefa),
            headers : {
                'authorization' : 'Bearer ' + localStorage.getItem('token-gerir'),
                'content-type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then(() => {
            alert('Tarefa salva');

            listarTarefas();

            limparCampos();
        })    
    }   
    const editar =(event) =>{


            fetch('http://localhost:63095/api/tarefa/' + event.target.value,{
            method : 'GET',
            headers : {
                'authorization' : 'Bearer ' + localStorage.getItem('token-gerir')
            }
        })
        .then(response => response.json())
        .then(data =>{
            console.log(data)
            setId(data.id);
            setTitulo(data.titulo);
            setDescricao(data.descricao);
            setCategoria(data.categoria);
            setdataEntrega(data.dataEntrega.substring(0,10));
            setStatus(data.status);
            
        })
        .catch(error=>{
            console.error(error);
        })
    }
    const excluir = (event) => {
        if(window.confirm("Deseja realmente excluir a tarefa?"))
            fetch('http://localhost:63095/api/tarefa/' + event.target.value, {
                method : 'Delete',
                headers : {
                    'authorization' : 'Bearer ' + localStorage.getItem('token-gerir')
                }
            })
            .then(() => {
                alert('Tarefa excluída!')

                listarTarefas();
            })
    }
    const alterarStatus = (event) =>{
        if(window.confirm("Deseja realmente alterar o status da tarefa?"))
        fetch('http://localhost:63095/api/tarefa/status/' + event.target.value, {
            method : 'Put',
            headers : {
                'authorization' : 'Bearer ' + localStorage.getItem('token-gerir')
            }
        })
        .then(() => {
            alert('Tarefa alterada!')

            listarTarefas();
        })
    }


    const limparCampos = () => {
        setId(0);
        setTitulo('');
        setDescricao('');
        setCategoria('');
        setdataEntrega('');
        setStatus(false);
    }

    return(

        <div>
<Container>
      
      <Card>
          <Card.Body>
              <Form onSubmit = {event => salvar(event)}>
                   <Form.Group controlId="formBasicTitulo">
                      <Form.Label>Título</Form.Label>
              <Form.Control type="text" value={titulo} onChange={event => setTitulo(event.target.value)} placeholder="Informe o titulo" required />
          </Form.Group>

          <Form.Group controlId="formBasicDescricao">
                      <Form.Label>Descrição</Form.Label>
              <Form.Control type="text" value={descricao} onChange={event => setDescricao(event.target.value)} placeholder="Informe a descrição" required />
          </Form.Group>

          <Form.Group controlId="formBasicCategoria">
                      <Form.Label>Categoria</Form.Label>
              <Form.Control type="text" value={categoria} onChange={event => setCategoria(event.target.value)} placeholder="Informe a categoria" required />
          </Form.Group>

          <Form.Group controlId="formBasicDataEntrega">
                      <Form.Label>Data Entrega</Form.Label>
              <Form.Control type="date" value={dataEntrega} onChange={event => setdataEntrega(event.target.value)} placeholder="Informe a data de entrega" required />
          </Form.Group>

          <Form.Group controlId="formBasicStatus">
                      <Form.Label>Status</Form.Label>
              <InputGroup.Prepend>
                      <InputGroup.Checkbox checked={status} onClick={!status} onChange={event=> setStatus(event.target.checked.value)} aria-label="Checkbox for allowing text input"></InputGroup.Checkbox>
              </InputGroup.Prepend>
          </Form.Group>

                  <Button type="submit">Salvar</Button>
              </Form>
          </Card.Body>
      </Card>

      <Table striped bordered hover>
          <thead>
              <tr>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Data Entrega</th>
                  <th>Status</th>
                  <th>Ações</th>
              </tr>
          </thead>
          <tbody>
                {   
                    tarefas.map((item, index) => {
                        return(
                            <tr>
                                <td>{item.titulo}</td>
                                <td>{item.descricao}</td>
                                <td>{item.categoria}</td>
                                <td>{item.dataEntrega}</td>
                                <td>{item.status ? 'Feito' : 'Para Fazer'}</td>
                                <td>
                                    <Button variant="warning" value={item.id} onClick={event => editar(event)}>Editar</Button>
                                    <Button variant="danger"  value={item.id} onClick={event => excluir(event)}>Excluir</Button>
                                    <Button variant="warning" value={item.id} onClick={event => alterarStatus(event)}>Alterar Status</Button>
                                </td>
                                
                                
                            </tr>
                        )
                    })
                }

          </tbody>
      </Table>
  </Container>
</div>
)}

export default Tarefas