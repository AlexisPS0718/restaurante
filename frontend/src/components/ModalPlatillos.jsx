'use client'
import { Group, Modal, Button, Flex, Text,TextInput, NumberInput, FileButton, Select, Image, Tabs,
} from "@mantine/core";
import { DeviceFloppy } from "tabler-icons-react";
import { PropTypes } from 'prop-types';
import "../styles/ModalEmpleados.css";
import { createPuesto, getAllPuestosList } from './../controllers/puestoController';
import { useEffect, useRef, useState } from "react";
import { useForm } from "@mantine/form";
import { createEmpleado, updateEmpleado } from "../controllers/empleadoControllers";
import { createPlatillo } from "../controllers/platilloController"
import { getAllCategorias, createCategoria } from "./../controllers/categoriaController"
import { useInputState } from "@mantine/hooks";
import { createImagen } from "../controllers/imagenController";
import { STORED_IMAGES_URL } from "../utils/constants";

function ModalPlatillos ({opened, close, update, updateInfo}) {
    const [puestos, setPuestos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [puestosC, setPuestosC] = useState([])
    const [categoriasC, setCategoriasC] = useState([])
    const [puesto, setPuesto] = useState('')
    const [categoria, setCategoria] = useState('')
    const [newPuestoN, setNewPuestoN] = useInputState('')
    const [newCategoriaN, setNewCategoriaN] = useInputState('')
    const [newSueldo, setNewSueldo] = useInputState(0)
    const [newCategoriaDesc, setNewCategoriaDesc] = useInputState('')
    const [aciveTab, setActiveTab] = useState('seleccionar')
    const categoriaIn = useRef()
    const [sueldo, setSueldo] = useState(0)
    const [file, setFile] = useState(null);
    const [fileCategoria, setFileCategoria] = useState(null);
    
    const getCategorias = async() => {
        const lista = await getAllCategorias()
        const list = lista.data.map((p) => Object.values(p))
        setCategoriasC(list)
        const listaP = []
        list.forEach((categoria) => {
            const p = {
                "value": categoria[0].toString(),
                "label": categoria[1],
            }
            listaP.push(p)
        })
        setCategorias(listaP)
        console.log(list)
    }
    /*
    const getCategoriaId = (nombre) => {
        const id = categoriasC.find((p) => p[1] === nombre)
        return id[0].toString()
    }*/

    const saveImage = async () => {
        const formData = new FormData()
        formData.append('image', file)
        const res = await createImagen(formData)
        return res
    }
    
    const saveImageCategoria = async () => {
        const formData = new FormData()
        formData.append('image', fileCategoria)
        const res = await createImagen(formData)
        return res
    }

    const form = useForm({
        initialValues: {
            platilloNombre: '',
            descripcion: '',
            precio: ''
        },
        validate: {
            platilloNombre: (value) => (value === '' ? 'Nombre no válido': null),
            descripcion: (value) => (value === '' ? 'Descripción no válida': null),
            precio: (value) => (value === '' ? 'Precio no válido': null)
        }
    })

    useEffect(() => {
        getCategorias()
        /*
        if (update) {
            form.setValues({
                platilloNombre: updateInfo.platilloNombre,
                descripcion: updateInfo.descripcion,
                precio: updateInfo.precio
            })
            //console.log(getCategoriaId(updateInfo.categoria))
            setCategoria(getCategoriaId(updateInfo.categoria))
        } else {
            form.setValues({
                platilloNombre: '',
                descripcion: '',
                precio: '',
            })
            setCategoria('')
            setFile(null)
            setFileCategoria(null)
        }
        */
        form.setValues({
            platilloNombre: '',
            descripcion: '',
            precio: '',
        })
        setCategoria('')
        setFile(null)
        setFileCategoria(null)
    }, [updateInfo])



    const handleCreatePlatillo = async (values) => {
        form.validate()
        const img = await saveImage()
        if (img.status === 200) {
            const res = await createPlatillo(values.platilloNombre, values.descripcion, values.precio, Number(categoria), img.data.imagenId)
            if (res.status === 200) {
                console.log(res)
                close()
            }
        }
    }
/*
    const handleUpdateEmpleado = async (values) => {
        console.log(file)
        form.validate()
        if (file !== null) {
            const img = await saveImage()
            console.log(img)
            if (img.status === 200) {
                updateInfo.imagenId = img.data.imagenId
            }
        }
        const res = await updateEmpleado(updateInfo.empleadoId, values.nombre, values.paterno, values.materno, values.telefono, Number(puesto), updateInfo.imagenId)
        if (res.status === 200) {
            close()
        }
    }*/

    const handleCreateCategoria = async () => {
        const img = await saveImageCategoria()
        if (img.status === 200) {
            const res = await createCategoria(newCategoriaN, newCategoriaDesc, img.data.imagenId)
            if (res.status === 200) {
                setActiveTab('seleccionar')
                getCategorias()
                setCategoria(res.data.categoriaNombre)
                close()
            }
        }
    }
    return (
        <Modal.Root opened={opened} onClose={close} centered size="xl" closeOnClickOutside w={200} h={500}>
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title  fw="bold" ta="center" ml="auto">{ update ? 'Actualizar': 'Agregar' } platillo</Modal.Title>
                    <Modal.CloseButton bg="gris" color="negro"></Modal.CloseButton>
                </Modal.Header>
                <Modal.Body>
                    { update ?
                    <Text>Placeholder</Text>
                    /*
                        <form onSubmit={form.onSubmit(handleUpdateEmpleado)}>
                        <Flex direction="row" align="flex-start" justify="center" gap={20}>
                            <Flex direction="column"  w="45%">
                                <Text fw="bold">Datos personales</Text>
                                <TextInput {...form.getInputProps('nombre')} label="Nombre" w='95%' />
                                <Group>
                                    <TextInput {...form.getInputProps('paterno')} label="Apellido paterno" w='45%'  />
                                    <TextInput {...form.getInputProps('materno')} label="Apellido materno" w='45%'  />
                                </Group>
                                <TextInput {...form.getInputProps('telefono')} label="Número de teléfono"  w='95%'  />
                                <Tabs value={aciveTab} onChange={setActiveTab} >
                                    <Tabs.List>
                                        <Tabs.Tab value="seleccionar" >Seleccionar puesto</Tabs.Tab>
                                        <Tabs.Tab value="crear" >Crear puesto</Tabs.Tab>
                                    </Tabs.List>
                                    <Tabs.Panel value="seleccionar">
                                        <Select label="Puesto" ref={puestoIn}  w='95%' defaultValue={puesto}  onChange={(value, option) => {
                                            setPuesto(value)
                                            setSueldo(getSueldo(value))
                                        }}  data={puestos}/>
                                        <NumberInput label="Sueldo" w='95%'  readOnly value={sueldo} />
                                    </Tabs.Panel>
                                    <Tabs.Panel value="crear">
                                            <TextInput name="puestoNombre" onChange={setNewPuestoN}  label="Nombre del puesto" w='95%' />
                                            <NumberInput name="sueldo" onChange={setNewSueldo} label="Sueldo" w='95%' />
                                            <Button mt={10} onClick={handleCreatePuesto} >Crear puesto</Button>
                                    </Tabs.Panel>
                                </Tabs>
                            </Flex>
                            <Flex direction="column" w="45%">
                                <Text fw="bold">Foto de perfil</Text>
                                <Group>
                                    <Image src={file ? URL.createObjectURL(file) : `${STORED_IMAGES_URL}${updateInfo.imagenUrl}`} radius='md' w={150} h={150}  />
                                    <FileButton onChange={setFile} accept="image/png,image/jpeg">
                                        {(props) => <Button color="brown.9" {...props}>Subir imagen</Button>}
                                    </FileButton>
                                </Group>
                            </Flex>
                        </Flex>
                        <Group justify='center' align="center" mt={16}>
                            <Button type="submit" leftSection={<DeviceFloppy />} >Actualizar</Button>
                            <Button color="black" onClick={close}>Cancelar</Button>
                        </Group>
                        </form>
                        */
                    :
                        <form onSubmit={form.onSubmit(handleCreatePlatillo)}>
                        <Flex direction="row" align="flex-start" justify="center" gap={20}>
                            <Flex direction="column" w="45%">
                                <Text fw="bold">Información del platillo</Text>
                                <TextInput {...form.getInputProps('platilloNombre')} label="Nombre" w='95%' />
                                <TextInput {...form.getInputProps('descripcion')} label="Descripción" w='95%' />
                                <NumberInput {...form.getInputProps('precio')} label="Precio" w='95%' />
                                <Tabs value={aciveTab} onChange={setActiveTab} >
                                    <Tabs.List>
                                        <Tabs.Tab value="seleccionar" >Seleccionar categoría</Tabs.Tab>
                                        <Tabs.Tab value="crear" >Crear categoría</Tabs.Tab>
                                    </Tabs.List>
                                    <Tabs.Panel value="seleccionar">
                                        <Select label="Categoria" ref={categoriaIn}  w='95%' defaultValue={categoria}  onChange={(value, option) => {
                                            setCategoria(value)
                                        }}  data={categorias}/>
                                        
                                    </Tabs.Panel>
                                    <Tabs.Panel value="crear">
                                            <TextInput name="categoriaNombre" onChange={setNewCategoriaN}  label="Nombre de la categoría" w='95%' />
                                            <TextInput name="descripcion" onChange={setNewCategoriaDesc}  label="Descripción de la categoría" w='95%' />
                                            <Group mb={10}>
                                            <Image src={fileCategoria ? URL.createObjectURL(fileCategoria) : null} radius='md' w={150} h={150}  />
                                            <FileButton onChange={setFileCategoria} accept="image/png,image/jpeg">
                                                {(props) => <Button color="brown.9" {...props}>Subir imagen</Button>}
                                            </FileButton>
                                            </Group>
                                            <Button mt={10} onClick={handleCreateCategoria} >Crear categoría</Button>
                                    </Tabs.Panel>
                                </Tabs>
                            </Flex>
                            <Flex direction="column" w="45%">
                                <Text fw="bold">Imagen para el platillo</Text>
                                <Group mb={10}>
                                    <Image src={file ? URL.createObjectURL(file) : null} radius='md' w={150} h={150}  />
                                    <FileButton onChange={setFile} accept="image/png,image/jpeg">
                                        {(props) => <Button color="brown.9" {...props}>Subir imagen</Button>}
                                    </FileButton>
                                </Group>
                            </Flex>
                        </Flex>
                        <Group justify='center' align="center" mt={16}>
                            <Button type="submit" leftSection={<DeviceFloppy />} >Guardar</Button>
                            <Button color="black" onClick={close}>Cancelar</Button>
                        </Group>
                        </form>
                    }
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
}

ModalPlatillos.propTypes = {
    opened: PropTypes.bool,
    close: PropTypes.func,
    update: PropTypes.bool,
    updateInfo: PropTypes.object
};

export default ModalPlatillos;