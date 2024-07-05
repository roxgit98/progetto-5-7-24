import React, { useState, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import { BrightnessHighFill } from "react-bootstrap-icons";

const Home = () => {
  const [search, setSearch] = useState("");
  const [citta, setCitta] = useState({});
  const [dati, setDati] = useState({});

  useEffect(() => {
    fetchGeo();
  }, [citta]);

  const fetchSearch = () => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=0dce2f6e458132caf6bb5ad320839c9e`
    )
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw new Error("Errore nella richiesta");
        }
      })
      .then((data) => {
        console.log("città", data);
        if (data.length > 0) {
          setCitta({ lat: data[0].lat, lon: data[0].lon });
        } else {
          throw new Error("Nessun risultato trovato");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchGeo = () => {
    if (citta.lat && citta.lon) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${citta.lat}&lon=${citta.lon}&appid=0dce2f6e458132caf6bb5ad320839c9e`
      )
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          } else {
            throw new Error("Errore nella richiesta");
          }
        })
        .then((data) => {
          console.log("dati", data);
          setDati(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Latitudine e longitudine non valide");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSearch();
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="search" className="mb-4">
          <Form.Label>Cerca</Form.Label>
          <Form.Control
            type="text"
            value={search}
            placeholder="Cerca una città"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form.Group>
      </Form>

      {dati.main && (
        <Card bg="transparent" border="light">
          <BrightnessHighFill color="yellow" size={170} />
          <Card.Body>
            <Card.Title>{dati.name}</Card.Title>
            <Card.Text>
              <b>Temperatura:</b> {Math.round(dati.main.temp - 273)}°C
            </Card.Text>

            <a href={`/details/${dati.id}`} className="btn btn-primary">
              Dettagli
            </a>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default Home;
