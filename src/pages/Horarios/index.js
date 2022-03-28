import { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Button, DatePicker, Drawer, Modal, TagPicker } from 'rsuite'
import RemindFillIcon  from '@rsuite/icons/RemindFill';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'rsuite/dist/rsuite-rtl.min.css';
import moment from 'moment';
import 'moment/locale/pt-br'
import { allHorarios , allServicos, updateHorario , filterColaboradores , addHorario, resetHorario, removeHorario } from '../../store/modules/horario/actions'
import { useDispatch , useSelector } from 'react-redux'
import ModalBody from 'rsuite/esm/Modal/ModalBody';
import ModalFooter from 'rsuite/esm/Modal/ModalFooter';


moment.locale('pt-br')
const localizer = momentLocalizer(moment)

const Horarios = () => {

    const dispatch = useDispatch();
    const { horarios , horario , servicos , colaboradores , components  , form , behavior } = useSelector(state => state.horario);

    const diasSemanaData = [
        new Date(2022, 3, 17, 0, 0, 0, 0),
        new Date(2022, 3, 18, 0, 0, 0, 0),
        new Date(2022, 3, 19, 0, 0, 0, 0),
        new Date(2022, 3, 20, 0, 0, 0, 0),
        new Date(2022, 3, 21, 0, 0, 0, 0),
        new Date(2022, 3, 22, 0, 0, 0, 0),
        new Date(2022, 3, 23, 0, 0, 0, 0),
    ];

    const diasDaSemana = [
        'domingo',
        'segunda-feira',
        'terça-feira',
        'quarta-feira',
        'quinta-feira',
        'sexta-feira',
        'sabado'
    ];

    const formatEvents = horarios.map((horario, index) => horario.dias.map((dia) =>({
        resource: horario, 
        title: `${horario.especialidades.length} espec. e ${horario.colaboradores.length} colab. `,
        start: new Date(
            diasSemanaData[dia].setHours(
                parseInt(moment(horario.inicio).format('HH')),
                parseInt(moment(horario.inicio).format('mm'))
            )
        ),
        end: new Date(
            diasSemanaData[dia].setHours(
                parseInt(moment(horario.fim).format('HH')),
                parseInt(moment(horario.fim).format('mm'))
            )
        ),
    }))).flat();

    const setComponent = (component, state) =>{
        dispatch(updateHorario({
          components: {...components , [component]: state },
        }));
    };

    const setHorario = ( key, value) =>{
        dispatch(updateHorario({
          horario: {...horario , [key]: value },
        }));
    };
      
    const save = () => {
        dispatch(addHorario());
      }

    useEffect(()=>{
        dispatch(allHorarios());
        dispatch(allServicos());
    }, [])

    useEffect(()=>{
        dispatch(filterColaboradores());
    }, [horario.especialidades])
    
    return (
        <div className='col p-5 overflow-auto h-100'>
            <Drawer
                open={components.drawer}
                size='sm'
                placement={'left'}
                onClose={() => setComponent('drawer', false)}
            >
                <Drawer.Body>
                    <h3>{behavior === 'create' ? 'Criar novo' : 'Atualizar'} horario de atendimento </h3>
                    <div className='row mt-3'>
                        <div className='col-12'>
                            <b>Dias da semana</b>
                            <TagPicker
                                size='lg'
                                block
                                value={horario.dias}
                                data={diasDaSemana.map((label,value) => ({label, value}))}
                                onChange={(value) =>{
                                    setHorario('dias', value);
                                }}
                            />
                        </div>
                        <div className='col-6 mt-3'>
                            <b className='d-block'>Horario Inicial</b>
                            <DatePicker
                                block
                                format="HH:mm" 
                                hideMinutes={(min) => ![0 ,30].includes(min)}
                                onChange={(e) => {setHorario('inicio', e);}}
                            />
                        </div>
                        <div className='col-6 mt-3'>
                            <b className='d-block'>Horario Final</b>
                            <DatePicker
                                block
                                format="HH:mm"
                                hideMinutes={(min) => ![0 ,30].includes(min)}
                                onChange={(e) => {setHorario('fim', e);}}
                            />
                        </div>
                        <div className='col-12'>
                            <b>Especialidades disponiveis</b>
                            <TagPicker
                                size='lg'
                                block
                                data={servicos}
                                value={horario.especialidades}
                                onChange={(e) =>{
                                    setHorario('especialidades', e);
                                }}
                            />
                        </div>  
                        <div className='col-12'>
                            <b>Colaboradores disponiveis</b>
                            <TagPicker
                                size='lg'
                                block
                                data={colaboradores}
                                value={horario.colaboradores}
                                onChange={(e) =>{
                                    setHorario('colaboradores', e);
                                }}
                            />
                        </div>
                    </div>
                    <Button
                        loading={form.saving}
                        color={behavior === 'create' ? 'green' : 'blue'}
                        appearance="primary"
                        size='lg'
                        block
                        onClick={() => save()}
                        className='mt-3'
                    >
                        Salvar Horario de Atendimento
                    </Button>
                    {behavior === 'update' &&(
                        <Button
                        block
                        className='mt-1'
                        color={'red'}
                        appearance="primary"
                        size='lg'
                        loading={form.saving}
                        onClick={() => setComponent('confirmDelete', true)}
                        >
                        Remover Horario de Atendimento
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
                <Button loading={form.saving} onClick={() => dispatch(removeHorario())} color="red" appearance="primary">
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
            <div className='row'>
                <div className='col-12'>
                    <div className="w-100 d-flex justify-content-between">
                    <h2 className="mb-4 mt-0">Horarios de atendimento</h2>
                        <div>
                        <button 
                            className="btn btn-primary btn-lg"
                            onClick={()=>{
                                dispatch(
                                  updateHorario({
                                    behavior: "create",
                                  })
                                )
                                setComponent('drawer', true)
                                dispatch(
                                  resetHorario()
                                )
                              }}
                        >
                            <spam className="mdi mdi-plus">Novo Horario</spam>
                        </button>
                        </div>
                    </div>
                    <Calendar
                        onSelectEvent={e =>{
                            dispatch( 
                                updateHorario({
                                  behavior: "update",
                                })
                              )
                              dispatch(
                                updateHorario({
                                  horario : e.resource,
                                })
                              )
                              setComponent('drawer', true);
                        }}
                        onSelectSlot={(slotInfo)=>{
                            const { start , end } = slotInfo;
                            dispatch(
                                updateHorario({
                                    behavior: "create",
                                    horario: {
                                        ...horario,
                                        dias: [moment(start).day()],
                                        inicio: start,
                                        fim: end,
                                    }
                                })
                            );
                            setComponent('drawer', true)
                        }}
                        localizer={localizer}
                        toolbar={false}
                        popup
                        selectable
                        formats={{
                            dateFormat: 'dd',
                            dayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),
                        }}
                        events={formatEvents}
                        date={diasSemanaData[moment().day()]}
                        view='week'
                        style={{ height: 500 }}
                    />
                </div>
            </div>
        </div>
        
    )
}

export default Horarios;