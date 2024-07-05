import { useState, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import { BrightnessHighFill } from "react-bootstrap-icons";

const Home = () => {
  const [search, setSearch] = useState("");
  const [citta, setCitta] = useState({});
  const [dati, setDati] = useState({});
  const [fiveDays, setFiveDays] = useState([]);

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
          return fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${citta.lat}&lon=${citta.lon}&appid=0dce2f6e458132caf6bb5ad320839c9e`
          );
        })
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          } else {
            throw new Error("Errore nella richiesta delle previsioni");
          }
        })
        .then((data) => {
          console.log("fiveDays", data);
          setFiveDays(data.list);
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
        <div className="mb-5 d-flex justify-content-center">
          <Card bg="transparent" border="light">
            <div className="d-flex justify-content-center">
              <BrightnessHighFill color="yellow" size={80} />
            </div>
            <Card.Body>
              <Card.Title className="text-white">{dati.name}</Card.Title>
              <Card.Text>
                <b>Temperatura:</b> {Math.round(dati.main.temp - 273)}°C
              </Card.Text>
              <Card.Text>
                <b>Temperatura massima:</b>{" "}
                {Math.round(dati.main.temp_max - 273)}
                °C
              </Card.Text>
              <Card.Text>
                <b>Temperatura minima:</b>{" "}
                {Math.round(dati.main.temp_min - 273)}
                °C
              </Card.Text>
              <Card.Text>
                <b>Umidità:</b> {Math.round(dati.main.humidity)}%
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      )}

      {fiveDays.length > 0 && (
        <div className="d-flex gap-3">
          {fiveDays.slice(0, 5).map((fiveDays, index) => (
            <Card key={index} bg="transparent" border="light">
              <div className="d-flex justify-content-center">
                <BrightnessHighFill color="yellow" size={80} />
              </div>
              <Card.Body>
                <Card.Title className="text-white">
                  {fiveDays.dt_txt}
                </Card.Title>
                <Card.Text>
                  <b>Temperatura:</b> {Math.round(fiveDays.main.temp - 273)}°C
                </Card.Text>
                <Card.Text>
                  <b>Temperatura massima:</b>{" "}
                  {Math.round(fiveDays.main.temp_max - 273)}°C
                </Card.Text>
                <Card.Text>
                  <b>Temperatura minima:</b>{" "}
                  {Math.round(fiveDays.main.temp_min - 273)}°C
                </Card.Text>
                <Card.Text>
                  <b>Umidità:</b> {fiveDays.main.humidity}%
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default Home;
