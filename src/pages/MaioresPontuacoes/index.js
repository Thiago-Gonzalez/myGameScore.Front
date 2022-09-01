import { FooterComponent } from '../../components/FooterComponent';
import { NavbarComponent } from '../../components/NavbarComponent';

import { Container, Table } from 'react-bootstrap';

import './maiorespontuacoes.css';

import basketball from '../../assets/basketball.png';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatDateBr } from '../../utils';
import { Link } from 'react-router-dom';

export const MaioresPontuacoes = () => {
    const [token] = useState(localStorage.getItem('token'));
    const [matches, setMatches] = useState([]);
    const [loadingMatches, setLoadingMatches] = useState(false);


    useEffect(() => {
        async function loadMatches() {
            setLoadingMatches(true);
            await api.get("/api/matches", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                if (response.status === 200) {
                    setMatches(response.data);
                }
                setLoadingMatches(false);
            })
            .catch(err => {
                setLoadingMatches(false);
                console.log(err);
            })
        }

        loadMatches();
    }, [token]);

    if (loadingMatches) {
        return(
            <div id="maiores-pontuacoes-page">
                <NavbarComponent />
                <Container className="mp-content">
                    <img src={basketball} alt="Imagem ilustrativa de cesta de basquete" />
                    <div>
                        <h1>Maiores Pontuações</h1>
                        <p>Carregando dados...</p>
                    </div>
                </Container>
                <FooterComponent />
            </div>
        );
    }

    return (
        <div id="maiores-pontuacoes-page">
            <NavbarComponent />
            <Container className="mp-content">
                <img src={basketball} alt="Imagem ilustrativa de cesta de basquete" />
                <div>
                    <h1>Maiores Pontuações</h1>
                    {matches.length === 0 ? (
                        <>
                            <p>
                                Ooops, parece que nenhum jogador já cadastrou partidas! <Link to="/lancar-pontos">Seja o primeiro</Link>
                            </p>
                        </>
                    ) : (
                        <Table>
                            <thead>
                                <tr>
                                    <th scope='col'>#</th>
                                    <th scope='col'>Jogador</th>
                                    <th className='points' scope='col'>Pontos</th>
                                    <th scope='col'>Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches
                                    .sort((m1, m2) => {
                                        return m1.score - m2.score;
                                    })
                                    .reverse()
                                    .slice(0, 10)
                                    .map((match, index) => {
                                        return(
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td data-aria-label='Jogador'>{match.playerName}</td>
                                                <td className='points' data-lavel="Pontos">{match.score}</td>
                                                <td data-label="Data">{formatDateBr(match.date)}</td>
                                            </tr>
                                        );
                                })}
                            </tbody>
                        </Table>
                    )}
                </div>
            </Container>
            <FooterComponent />
        </div>
    );
}