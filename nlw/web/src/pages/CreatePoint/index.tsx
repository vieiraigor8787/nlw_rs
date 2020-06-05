import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import api from '../../services/api';

import './styles.css';
import logo from '../../assets/logo.svg';

//array ou objeto manualmente tem que informar o tipo da variável

interface Item {
    id: number;
    name: string;
    icon_url: string;
}

interface IBGEUFInterface {
    sigla: string;
}

const CreatePoint = () => { 
    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, []);

    useEffect(() => {
        axios.get<IBGEUFInterface[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufName = response.data.map(uf => uf.sigla);

            setUfs(ufName)
        })
    }, []);
    //carregar as cidades quando a UF for escolhida
    useEffect(() => {

    })

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="">
                    <FiArrowLeft />
                    Voltar para a home
                </Link>
            </header>

            <form action="">
                <h1>Cadastro do <br/> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                          type="text"
                          name="name"
                          id="name"
                          />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                              type="email"
                              name="email"
                              id="email"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                              type="text"
                              name="whatsapp"
                              id="whatsapp"
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={[-23.5429771, -46.757523]} zoom={15}>
                      <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                      />
                      <Marker position={[-23.5429771, -46.757523]} />
                    </Map>
                    
                    <div className="field-group">
                        <div className="field">
                          <label htmlFor="uf">Estado (UF)</label>
                          <select name="uf" id="uf">
                              <option value="0">Selecione uma UF</option>
                              {ufs.map(uf => (
                                <option key={uf} value={uf}>{uf}</option>
                              ))}
                          </select>
                        </div>
                        <div className="field">
                          <label htmlFor="city">Cidade</label>
                          <select name="city" id="city">
                              <option value="0">Selecione uma cidade</option>
                          </select>
                        </div> 
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                          <li>
                            <img src={item.icon_url} alt={item.name}/>
                            <span>{item.name}</span>
                          </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar
                </button>
            </form>
        </div>
    )
}

export default CreatePoint;