import React, { useState, useCallback, useEffect, use } from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';

import { Container, Form, SubmitButton, List, DeleteButton } from './styles';

import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  //DidMount - Search

  useEffect(() => {
    const repoStorage = localStorage.getItem('repos');

    if (repoStorage) {
      setRepositories(JSON.parse(repoStorage));
    }
  }, []);

  // DidUpdate - Save the changes

  useEffect(() => {
    localStorage.setItem('repos', JSON.stringify(repositories));
  }, [repositories]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);

        setLoading(true);
        setAlert(null);

        try {
          if (newRepo === '') {
            throw new Error('You must inform a repository');
          }

          const response = await api.get(`/repos/${newRepo}`);

          const hasRepo = repositories.find((r) => r.name === newRepo);

          if (hasRepo) {
            throw new Error('Repository already exists');
          }

          const data = {
            name: response.data.full_name,
          };

          setRepositories([...repositories, data]);
          setNewRepo('');
        } catch (err) {
          setAlert(true);
          console.log(err);
        } finally {
          setLoading(false);
        }
      }

      submit();
    },
    [newRepo, repositories]
  );

  function handleInputChange(e) {
    setNewRepo(e.target.value);
    setAlert(null);
  }

  const handleDelete = useCallback(
    (repo) => {
      const find = repositories.filter((r) => r.name !== repo);
      setRepositories(find);
    },
    [repositories]
  );

  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        My repositories
      </h1>

      <Form onSubmit={handleSubmit} error={alert}>
        <input
          type="text"
          placeholder="Add repositories"
          value={newRepo}
          onChange={handleInputChange}
        />
        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#FFF" size={14} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {repositories.map((repository) => (
          <li key={repository.name}>
            <span>
              <DeleteButton onClick={() => handleDelete(repository.name)}>
                <FaTrash size={14} />
              </DeleteButton>
              {repository.name}
            </span>
            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
              <FaBars size={20} />
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
