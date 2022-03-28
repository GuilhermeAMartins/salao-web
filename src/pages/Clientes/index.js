import { useEffect } from 'react';
import { Button , Drawer , Modal  } from 'rsuite';
import GearIcon from '@rsuite/icons/Gear';
import 'rsuite/dist/rsuite-rtl.min.css';
import Table from '../../components/Table';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { allClients , updateCliente , filterClientes , addCliente , unlinkCliente , resetCliente } from '../../store/modules/cliente/actions';
import ModalBody from 'rsuite/esm/Modal/ModalBody';
import ModalFooter from 'rsuite/esm/Modal/ModalFooter';



const Clientes = () =>{

  const dispatch = useDispatch();
  const { clientes , cliente , form , components , behavior } = useSelector((state) => state.cliente);
  const infoCliente = cliente;
  const todosClientes = clientes;
 

  const setComponent = (component, state) =>{
    dispatch(updateCliente({
      components: {...components , [component]: state },
    }));
  }
  
  const setCliente = ( key, value) =>{
    dispatch(updateCliente({
      cliente: {...infoCliente , [key]: value },
    }));
  }

  const save = () => {
    dispatch(addCliente());
  }

  useEffect(() =>{
    dispatch(allClients());
  }, []);

  return (
    <div className="col p-5 overflow-auto w-100">
      <Drawer open={components.drawer} placement={'left'} size='sm' onClose={() => setComponent('drawer', false)}>
        <Drawer.Body>
          <h3>{behavior === "create" ? "Criar novo " : "Atualizar " }cliente</h3>
          <div className='row mt-3'>
            <div className='form-group col-12 mb-3'>
              <b>E-mail</b>
              <div className='input-group'>
                <input 
                  type="email" 
                  className="form-control" 
                  disabled={behavior === 'update'}
                  placeholder='E-mail do cliente' 
                  value={infoCliente.email}
                  onChange={(e) =>{setCliente('email',e.target.value)}}
                />
                {behavior === 'create' && <div className='input-group-append'>
                  <Button 
                    appearance="primary" 
                    loading={form.filtering} 
                    disabled={form.filtering} 
                    onClick={() => dispatch(filterClientes())}
                  >Pesquisar</Button>
                  </div>}
              </div>
            </div>
            <div className='form-group col-6'>
              <b className=''>Nome</b>
              <input
                type="text"
                className="form-control"
                placeholder='Nome do Cliente'
                disabled={form.disabled}
                value={infoCliente.nome}
                onChange={(e) => setCliente('nome', e.target.value)}  
              />
            </div>
            <div className='form-group col-6'>
              <b className=''>Telefone / Whatsapp</b>
              <input
                type="text"
                className="form-control"
                placeholder='Telefone / Whatsapp'
                disabled={form.disabled}
                value={infoCliente.telefone}
                onChange={(e) => setCliente('telefone', e.target.value)}  
              />
            </div>
            <div className='form-group col-6'>
              <b className=''>Data de Nascimento</b>
              <input
                type="date"
                className="form-control"
                disabled={form.disabled}
                value={infoCliente.dataNascimento}
                onChange={(e) => setCliente('dataNascimento', e.target.value)}  
              />
            </div>
            <div className='form-group col-6'>
              <b className=''>Sexo</b>
              <select
                disabled={form.disabled}
                className="form-control"
                value={infoCliente.sexo}
                onChange={(e) => setCliente('sexo', e.target.value)}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
              </select>
            </div>
            <div className='form-group col-6'>
              <b className=''>Tipo de documento</b>
              <select
                className="form-control"
                placeholder='Telefone / Whatsapp'
                disabled={form.disabled}
                value={infoCliente.documento.tipo}
                onChange={(e) => setCliente('documento', { 
                  ...infoCliente.documento , 
                  tipo: e.target.value,
                  })
                }  
              >
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
              </select>
            </div>
            <div className='form-group col-6'>
              <b className=''>Numero do documento</b>
              <input
                type="text"
                className="form-control"
                placeholder='Nome do Cliente'
                disabled={form.disabled}
                value={infoCliente.documento.numero}
                onChange={(e) => setCliente('documento',{ 
                  ...infoCliente.documento , 
                  numero: e.target.value,
                  })
                }  
              />
            </div>
            <div className='form-group col-3'>
              <b className=''>CEP</b>
              <input
                type="text"
                className="form-control"
                placeholder='Digite o CEP'
                disabled={form.disabled}
                value={infoCliente.endereco.cep}
                onChange={(e) => setCliente('endereco', {
                  ...infoCliente.endereco,
                  cep :e.target.value,
                })
              }  
              />
            </div>
            <div className='form-group col-6'>
              <b className=''>Rua / Logradouro</b>
              <input
                type="text"
                className="form-control"
                placeholder='Rua / Logradouro'
                disabled={form.disabled}
                value={infoCliente.endereco.logradouro}
                onChange={(e) => setCliente('endereco', {
                  ...infoCliente.endereco,
                  logradouro :e.target.value,
                })
              }  
              />
            </div>
            <div className='form-group col-3'>
              <b className=''>Numero</b>
              <input
                type="text"
                className="form-control"
                placeholder='Numero'
                disabled={form.disabled}
                value={infoCliente.endereco.numero}
                onChange={(e) => setCliente('endereco', {
                  ...infoCliente.endereco,
                  numero :e.target.value,
                })
              }  
              />
            </div>
            <div className='form-group col-3'>
              <b className=''>UF</b>
              <input
                type="text"
                className="form-control"
                placeholder='UF'
                disabled={form.disabled}
                value={infoCliente.endereco.uf}
                onChange={(e) => setCliente('endereco', {
                  ...infoCliente.endereco,
                  uf :e.target.value,
                })
              }  
              />
            </div>
            <div className='form-group col-9'>
              <b className=''>Cidade</b>
              <input
                type="text"
                className="form-control"
                placeholder='Cidade'
                disabled={form.disabled}
                value={infoCliente.endereco.cidade}
                onChange={(e) => setCliente('endereco', {
                  ...infoCliente.endereco,
                  cidade: e.target.value,
                })
              }  
              />
            </div>
          </div>
          <Button
            block
            className='btn-lg mt-3'
            color={behavior === "create" ? "green" : "red"}
            appearance="primary"
            size='lg'
            loading={form.saving}
            onClick={() => {
              if(behavior === "create" ){
                save();
              }else{
                setComponent('confirmDelete', true);
              }
            }}
          >
            {behavior === "create" ? "Salvar" : "Remover"} Cliente
          </Button>
        </Drawer.Body>
      </Drawer>
      <Modal
        open={components.confirmDelete}
        onClose={() => setComponent('confirmDelete', false)}
        size='xs'
      >
        <ModalBody>
          <GearIcon
            icon='remind'
            style={{
              color: '#ffb300',
              fontsize: 24,
            }}
          />
          {' '} Tem certeza que desaja excluir? Essa ação será irreversível!
        </ModalBody>
        <ModalFooter>
          <Button loading={form.saving} onClick={() => dispatch(unlinkCliente())} color="red" appearance="primary">
            Sim, tenho certeza!
          </Button>
          <Button 
            onClick={() => setComponent('confirmDelete' , false)}
            appearance='subtle'
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <div className="row">
          <div className="col-12">
              <div className="w-100 d-flex justify-content-between">
                <h2 className="mb-4 mt-0">Clientes</h2>
                <div>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={()=>{
                      dispatch(
                        updateCliente({
                          behavior: "create",
                        })
                      )
                      setComponent('drawer', true)
                      dispatch(
                        resetCliente()
                      )
                    }}
                  >
                    <spam className="mdi mdi-plus">Novo Cliente</spam>
                  </button>
                </div>
              </div>
            <Table 
              loading={form.filtering}
              data={todosClientes}
              config={[
                { label: 'Nome', content: (cliente) => cliente.nome, width: 200, fixed: true},
                { label: 'E-mail', content: (cliente) => cliente.email, width: 200},
                { label: 'Telefone', content: (cliente) => cliente.telefone, width: 200},
                { label: 'Sexo', content: (cliente) => cliente.sexo === 'M' ? 'Masculino' : 'Feminino', width: 200},
                { label: 'Data Cadastro',  content: (cliente) => moment(cliente.dataCadastro).format('DD/MM/YYYY'), width: 200},
              ]}
              actions={(cliente) => (
                  <Button appearance="primary" size="xs">Ver informações</Button>
              )}
              onRowClick={(cliente) => {
                dispatch( 
                  updateCliente({
                    behavior: "update",
                  })
                )
                dispatch(
                  updateCliente({
                    cliente,
                  })
                )
                setComponent('drawer', true);

              }}
            />
          </div>
      </div>
    </div>
  );
};

export default Clientes;