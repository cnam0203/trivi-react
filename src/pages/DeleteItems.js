import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Container,
  Form,
  InputGroup,
} from "@themesberg/react-bootstrap";
import { useHistory, useLocation } from "react-router";
import ProcessTables from "./tables/ProcessTables";
import { TabTitle } from "../constants/generalFunctions";
import { AppContext } from "./AppContext";

export default () => {
  TabTitle("Delete Items");

  const { fetchRequest } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [searchItems, setSearchItems] = useState([]);
  const itemType = location.pathname.split("/").slice(-1)[0];
  const columns = searchItems.length
    ? Object.keys(searchItems[0]).map((key) => {
        return { Header: key, accessor: key };
      })
    : [];

  useEffect(() => {
    fetchRequest(`dimadb/get-import-info/${itemType}/`, "GET")
      .then((data) => {
        setAllItems(data.items);
      })
      .catch((err) => alert(err));
  }, []);

  const handleDelete = (importId) => {
    fetchRequest(
      `dimadb/delete-multiple-items/${itemType}/${importId}/`,
      "DELETE"
    )
      .then((data) => {
        alert(`Delete ${itemType} successfully`);
        history.go(0);
      })
      .catch((err) => alert(err));
  };

  const setAllItems = (json, level = 2) => {
    if (level >= 2) setItems(json);
    if (level >= 1) setSearchItems(json);
  };

  const searchKeyWord = (keyword) => {
    if (keyword === "") {
      setAllItems(items, 2);
    } else {
      var filteredKeyWord = [];
      for (var i = 0; i < items.length; i++) {
        const obj = items[i];
        const keys = Object.keys(obj);
        for (var j = 0; j < keys.length; j++) {
          const value = String(obj[keys[j]]).toLowerCase();
          if (value.includes(keyword.toLowerCase())) {
            filteredKeyWord.push(obj);
            break;
          }
        }
      }
      setAllItems(filteredKeyWord, 1);
    }
  };

  return (
    <article>
      <Container className="px-0">
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
          <Col className="d-block mb-4 mb-md-0">
            <h1 className="h2">Delete Items</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={9} className="mb-4"></Col>
          <Col xs={3} className="mb-4">
            <Form.Group>
              <InputGroup className="input-group-merge">
                <Form.Control
                  type="text"
                  placeholder="Recherche de mots clés"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      searchKeyWord(e.target.value);
                    }
                  }}
                />
                <InputGroup.Text>
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ cursor: "pointer" }}
                  />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        {columns.length > 0 ? (
          <ProcessTables
            columns={columns}
            data={searchItems}
            isViewDetail={false}
            handleViewDetail={() => {}}
            isDelete={true}
            handleDelete={handleDelete}
          />
        ) : (
          <></>
        )}
      </Container>
    </article>
  );
};
