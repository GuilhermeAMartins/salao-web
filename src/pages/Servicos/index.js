import { useEffect } from 'react';
import { Button , DatePicker, Drawer , Modal , Tag , Uploader} from 'rsuite';
import RemindFillIcon from '@rsuite/icons/RemindFill';
import SendIcon from '@rsuite/icons/Send';
import 'rsuite/dist/rsuite-rtl.min.css';
import Table from '../../components/Table';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { allServicos , updateServico , addServico , removeServico, resetServico, removeArquico  } from '../../store/modules/servico/actions';
import ModalBody from 'rsuite/esm/Modal/ModalBody';
import ModalFooter from 'rsuite/esm/Modal/ModalFooter';

import consts from '../../consts';

const Servicos = () =>{

  const dispatch = useDispatch();
  const { servicos , servico , form , components , behavior } = useSelector((state) => state.servico);
  const infoServico = servico;
  const todosServicos = servicos;

  const setComponent = (component, state) =>{
    dispatch(updateServico({
      components: {...components , [component]: state },
    }));
  }
  
  const setServico = ( key, value) =>{
    dispatch(updateServico({
        servico: {...infoServico , [key]: value },
    }));
  }

  const save = () => {
    dispatch(addServico());
  }
  useEffect(() =>{
    dispatch(allServicos());
  }, []);
  return (
    <div className="col p-5 overflow-auto w-100">
      <Drawer open={components.drawer} placement={'left'} size='sm' onClose={() => setComponent('drawer', false)}>
        <Drawer.Body>
          <h3>{behavior === "create" ? "Criar novo " : "Atualizar " }Servico</h3>
          <div className='row mt-3'>
            <div className='form-group col-6'>
              <b>Titulo</b>
              <input
                type='text'
                className='form-control'
                placeholder='Titulo do servico'
                value={servico.titulo}
                onChange={(e) => {setServico('titulo', e.target.value);}}
              />
            </div>
            <div className='form-group col-3'>
              <b>R$ Preco</b>
              <input
                type='number'
                className='form-control'
                placeholder='Preco do servico'
                value={servico.preco}
                onChange={(e) => {setServico('preco', e.target.value);}}
              />
            </div>
            <div className='form-group col-3'>
              <b>Recorr. (dias)</b>
              <input
                type='number'
                className='form-control'
                placeholder='Recorencia'
                value={servico.recorrencia}
                onChange={(e) => {setServico('recorrencia', e.target.value);}}
              />
            </div>
            <div className='form-group col-4'>
              <b>% Comissao</b>
              <input
                type='number'
                className='form-control'
                placeholder='Comissao'
                value={servico.comissao}
                onChange={(e) => {setServico('comissao', e.target.value);}}
              />
            </div>
            <div className='form-group col-4'>
              <b className='d-block' >Duracao</b>
              <DatePicker
                block
                format="HH:mm"
                value={new Date(servico.duracao)}
                hideMinutes={(min) => ![0 ,30].includes(min)}
                onChange={(e) => {setServico('duracao', e);}}
              />
            </div>
            <div className='form-group col-4'>
              <b>Status</b>
              <select
                className='form-control'
                value={servico.status}
                onChange={(e) => {setServico('status', e.target.value);}}
              >
                  <option value="A">Ativo</option>
                  <option value="I">Inativo</option>
              </select>
            </div>
            <div className='form-group col-12'>
              <b>Descricao</b>
              <textarea
                rows="5"
                className='form-control'
                placeholder='Descricao do servico ..'
                value={servico.descricao}
                onChange={(e) => {setServico('descricao', e.target.value);}}
              ></textarea>
            </div>
            <div className='form-group col-12'>
              <b className='d-block'>Imagens do servico</b>
              <Uploader
                multiple
                autoUpload={false}
                listType="picture"
                defaultFileList={servico.arquivos.map((servico, index) =>({
                    name: servico?.caminho,
                    fileKey: index,
                    url: `${consts.bucketUrl}/${servico?.caminho}`,
                }))}
                onChange={(files)=>{
                    const arquivos = files.filter((f) => f.blobFile ).map((f) => f.blobFile );
                    
                    setServico('arquivos', arquivos);
                }}
                onRemove={(file) =>{
                    if(behavior === "update" && file.url){
                        dispatch(removeArquico(file.name))
                    }
                }}
              >
                <button>
                    <SendIcon size='lg'/>
                </button>
              </Uploader>
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
            {behavior === "create" ? 'Salvar' : 'Editar'} Servico
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
              Remover Servico
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
          <Button loading={form.saving} onClick={() => dispatch(removeServico())} color="red" appearance="primary">
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
                <h2 className="mb-4 mt-0">Servicos</h2>
                <div>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={()=>{
                      dispatch(
                        updateServico({
                          behavior: "create",
                        })
                      )
                      setComponent('drawer', true)
                      dispatch(
                        resetServico()
                      )
                    }}
                  >
                    <spam className="mdi mdi-plus">Novo Servico</spam>
                  </button>
                </div>
              </div>
            <Table 
              loading={form.filtering}
              data={todosServicos}
              config={[
                { label: 'Titulo', key: 'titulo', width: 200, fixed: true},
                { label: 'R$ Preco', content: (servico) => `R$ ${servico.preco.toFixed(2)}`},
                { label: '% Comissao', content: (servico) => `${servico.comissao}%`},
                { label: 'Recorrencia (dias) ', content: (servico) => `${servico.recorrencia} dias`},
                { label: 'Duracao ', content: (servico) => moment(servico.duracao).format("HH:mm")},
                { label: 'Status ', key : 'status', content:(servico) =>( 
                    <Tag color={servico.status === "A" ? 'green' : 'red'}>
                        {servico.status === "A" ? 'Ativo' : 'Inativo'}
                    </Tag>)},
                ]}
              actions={() => (
                  <Button appearance="primary" size="xs">Ver informações</Button>
              )}
              onRowClick={(servico) => {
                dispatch( 
                  updateServico({
                    behavior: "update",
                  })
                )
                dispatch(
                  updateServico({
                    servico,
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

export default Servicos;