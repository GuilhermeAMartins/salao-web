import { useEffect } from 'react';
import { Button , Drawer , Modal , SelectPicker, TagPicker } from 'rsuite';
import RemindFillIcon  from '@rsuite/icons/RemindFill';
import 'rsuite/dist/rsuite-rtl.min.css';
import Table from '../../components/Table';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { allColaboradores , updateColaborador , filterColaborador , addColaborador , unlinkColaborador , resetColaborador , allServicos } from '../../store/modules/colaborador/actions';
import ModalBody from 'rsuite/esm/Modal/ModalBody';
import ModalFooter from 'rsuite/esm/Modal/ModalFooter';

import bancos from '../../data/bancos.json'

const Colaborador = () =>{

  const dispatch = useDispatch();
  const { colaboradores , colaborador , form , components , behavior , servicos } = useSelector((state) => state.colaborador);
  const infoColaborador = colaborador;
  const todosColaboradores = colaboradores;

  const setComponent = (component, state) =>{
    dispatch(updateColaborador({
      components: {...components , [component]: state },
    }));
  }
  
  const setColaborador = ( key, value) =>{
    dispatch(updateColaborador({
      colaborador: {...infoColaborador , [key]: value },
    }));
  }

  const setContaBancaria =  (key, value) =>{
    dispatch(updateColaborador({
      colaborador: {...infoColaborador , contaBancaria:{
        ...colaborador.contaBancaria, [key]: value }
      },
    }));
  }

  const save = () => {
    dispatch(addColaborador());
  }

  useEffect(() =>{
    dispatch(allColaboradores());
    dispatch(allServicos());
  }, []);
  
  return (
    <div className="col p-5 overflow-auto w-100">
      <Drawer open={components.drawer} placement={'left'} size='sm' onClose={() => setComponent('drawer', false)}>
        <Drawer.Body>
          <h3>{behavior === "create" ? "Criar novo " : "Atualizar " }Colaborador</h3>
          <div className='row mt-3' >
            <div className='form-group col-12 mb-3'>
              <b>E-mail</b>
              <div className='input-group'>
                <input 
                  disabled={behavior === 'update' }
                  type="email" 
                  className="form-control" 
                  placeholder='E-mail do colaborador' 
                  value={infoColaborador.email}
                  onChange={(e) => setColaborador('email',e.target.value)}
                />
                {behavior === 'create' &&<div className='input-group-append'>
                  <Button 
                    appearance="primary" 
                    loading={form.filtering} 
                    disabled={form.filtering} 
                    onClick={() => dispatch(filterColaborador())}
                  >Pesquisar</Button>
                </div>}
              </div>
            </div>
            <div className='form-group col-6'>
                <b>Nome</b>
                <div className='input-group'>
                  <input 
                    disabled={form.disabled}
                    type="text" 
                    className="form-control" 
                    placeholder='Nome do colaborador' 
                    value={infoColaborador.nome}
                    onChange={(e) => setColaborador('nome',e.target.value)}
                  />
              </div>
            </div>
            <div className='form-group col-6'>
                <b>Status</b>
                  <select 
                    disabled={form.disabled && behavior === 'create'}
                    className="form-control" 
                    value={behavior === 'create' ?infoColaborador.status : infoColaborador.vinculo}
                    onChange={(e) => setColaborador(behavior === 'create' ?'status' : 'vinculo', e.target.value)}
                  >
                    <option value="A">Ativo</option>
                    <option value="I">Inativo</option>
                  </select>
            </div>
             <div className='form-group col-5'>
                <b>Data de Nascimento</b>
                <div className='input-group'>
                  <input 
                    disabled={form.disabled}
                    type="date" 
                    className="form-control" 
                    placeholder='Data de Nascimento do colaborador' 
                    value={infoColaborador.dataNascimento}
                    onChange={(e) => setColaborador('dataNascimento',e.target.value)}
                  />
              </div>
            </div>
            <div className='form-group col-4'>
                <b>Telefone / Whatsapp</b>
                <div className='input-group'>
                  <input 
                    disabled={form.disabled}
                    type="text" 
                    className="form-control" 
                    placeholder='Telefone / Whatsapp colaborador' 
                    value={infoColaborador.telefone}
                    onChange={(e) => setColaborador('telefone',e.target.value)}
                  />
              </div>
            </div>
            <div className='form-group col-3  '>
                <b>Sexo</b>
                  <select 
                    disabled={form.disabled}
                    className="form-control" 
                    value={infoColaborador.sexo}
                    onChange={(e) => setColaborador('sexo',e.target.value)}
                  > 
                    <option value='M'>Masculino</option>
                    <option value='F'>Feminino</option>
                  </select>
            </div>
            <div className='col-12'>
              <b>Especialidades</b>
              <TagPicker
                size='lg'
                block
                data={servicos}
                disabled={form.disabled && behavior === 'create' && infoColaborador.dataNascimento === ""}
                value={infoColaborador.especialidades}
                onChange={(especialidade)=> setColaborador("especialidades", especialidade )}
              />
            </div>
            <div className='row mt-3'>
              <div className='form-group col-6'>
                <b>Titular da conta</b>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Nome do titular da conta'
                  disabled={form.disabled}
                  value={infoColaborador.contaBancaria.titular}
                  onChange={(e) => setContaBancaria('titular', e.target.value)}
                />
              </div>
              <div className='form-group col-6'>
                <b>CPF/CNPJ</b>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='CPF/CNPJ do titular'
                    disabled={form.disabled}
                    value={infoColaborador.contaBancaria.cpfCnpj}
                    onChange={(e) => setContaBancaria('cpfCnpj', e.target.value)}
                  />
              </div>
              <div className='form-group col-6'>
                <b>Banco</b>
                  <SelectPicker
                    disabled={form.disabled}
                    value={infoColaborador.contaBancaria.banco}
                    onChange={(banco) => setContaBancaria('banco',banco)}
                    data={bancos}
                    block
                    size="lg"
                  />
              </div>
              <div className='form-group col-6'>
                <b>Tipo de Conta</b>
                <select
                    className='form-control'
                    disabled={form.disabled}
                    value={infoColaborador.contaBancaria.tipo}
                    onChange={(e) => setContaBancaria('tipo', e.target.value)}
                >
                  <option value="conta_corrente">Conta Corente</option>
                  <option value="conta_poupanca">Conta Poupança</option>
                </select>
              </div>
              <div className='form-group col-6'>
                <b>Agencia</b>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Agencia'
                    disabled={form.disabled}
                    value={infoColaborador.contaBancaria.agencia}
                    onChange={(e) => setContaBancaria('agencia', e.target.value)}
                  />
              </div>
              <div className='form-group col-4'>
                <b>Numero da conta</b>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Numero da conta'
                    disabled={form.disabled}
                    value={infoColaborador.contaBancaria.numero}
                    onChange={(e) => setContaBancaria('numero', e.target.value)}
                  />
              </div>
              <div className='form-group col-2'>
                <b>Digito</b>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='DV'
                    disabled={form.disabled}
                    value={infoColaborador.contaBancaria.dv}
                    onChange={(e) => setContaBancaria('dv', e.target.value)}
                  />
              </div>
            </div>
          </div>
          <Button
            block
            className='btn-lg mt-3'
            color={behavior === "create" ? "green" : "blue"}
            appearance="primary"
            size='lg'
            loading={form.saving}
            onClick={() => save()}
          >
            {behavior === "create" ? 'Salvar' : 'Editar'} Colaborador
          </Button>
          {behavior === 'update' && (
            <Button
              block
              className='mt-1'
              color={'red'}
              appearance="primary"
              size='lg'
              loading={form.saving}
              onClick={() => setComponent('confirmDelete', true)}
            >
              Remover Colaborador
            </Button>
          )}
        </Drawer.Body>
      </Drawer>
      <Modal
        open={components.confirmDelete}
        onClose={() => setComponent('confirmDelete', false)}
        size='xs'
      >
        <ModalBody>
          <RemindFillIcon 
            icon='remind'
            style={{
              color: '#ffb300',
              fontsize: 24,
            }}
          />
          {' '} Tem certeza que desaja excluir? Essa ação será irreversível!
        </ModalBody>
        <ModalFooter>
          <Button loading={form.saving} onClick={() => dispatch(unlinkColaborador())} color="red" appearance="primary">
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
                <h2 className="mb-4 mt-0">Colaboradores</h2>
                <div>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={()=>{
                      dispatch(
                        updateColaborador({
                          behavior: "create",
                        })
                      )
                      setComponent('drawer', true)
                      dispatch(
                        resetColaborador()
                      )
                    }}
                  >
                    <spam className="mdi mdi-plus">Novo Colaborador</spam>
                  </button>
                </div>
              </div>
            <Table 
              loading={form.filtering}
              data={todosColaboradores}
              config={[
                { label: 'Nome', key: 'colaboradorId.nome', width: 200, fixed: true},
                { label: 'E-mail', key: 'colaboradorId.email', width: 200},
                { label: 'Telefone', key: 'colaboradorId.telefone', width: 200},
                { label: 'Sexo', content: (colaborador) => colaborador.colaboradorId.sexo === 'M' ? 'Masculino' : 'Feminino', width: 200},
                { label: 'Data Cadastro',  content: (colaborador) => moment(colaborador.colaboradorId.dataCadastro).format('DD/MM/YYYY'), width: 200},
              ]}
              actions={() => (
                  <Button appearance="primary" size="xs">Ver informações</Button>
              )}
              onRowClick={(colaborador) => {
                dispatch( 
                  updateColaborador({
                    behavior: "update",
                  })
                )
                dispatch(
                  updateColaborador({
                    colaborador: {...colaborador.colaboradorId,especialidades: colaborador.especialidades, vinculo: colaborador.vinculo, vinculoId: colaborador.vinculoId },
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

export default Colaborador;