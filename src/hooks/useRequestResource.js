import { useCallback, useState, useContext } from "react";
import apiClient from "src/helpers/axios/apiClient";
import { useSnackbar } from "notistack";
import formatHttpApiError from "src/helpers/formatHttpApiError";
import { LoadingOverlayResourceContext } from "src/components/LoadingOverlayResource";
import getCommonOptions from "src/helpers/axios/getCommonOptions";
export default function useRequestResource({ endpoint, resourceLabel }) {
  const [resourceList, setResourceList] = useState({
    results: [],
  });

  const [resource, setResource] = useState(null);
  const [error, setError] = useState(null);
  //Snackbar
  const { enqueueSnackbar } = useSnackbar();
  const loadingOverlay = useContext(LoadingOverlayResourceContext);

  const { setLoading } = loadingOverlay;

  //use formatHttpAPIError
  const handleRequestResourceError = useCallback(
    (err) => {
      const formattedError = formatHttpApiError(err);
      setError(formattedError);
      setLoading(false);
      enqueueSnackbar(formattedError);
    },
    [enqueueSnackbar, setError, setLoading]
  );
  //useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed.
  /* get resource by endpoint */
  const getResourceList = useCallback(
    ({ query = "" } = {}) => {
      setLoading(true);
      apiClient
        .get(`/api/${endpoint}/${query}`, getCommonOptions())
        .then((res) => {
          setLoading(false);
          if (res.data.results) {
            setResourceList(res.data);
          } else {
            setResourceList({
              results: res.data,
            });
          }
        })
        .catch(handleRequestResourceError);
    },
    [endpoint, handleRequestResourceError, setLoading]
  );

  /*  add resource */

  const addResource = useCallback(
    (values, successCallback) => {
      setLoading(true);
      apiClient
        .post(`/api/${endpoint}/`, values, getCommonOptions())
        .then(() => {
          setLoading(false);
          enqueueSnackbar(`${resourceLabel} added`);
          if (successCallback) {
            successCallback();
          }
        })
        .catch(handleRequestResourceError);
    },
    [
      endpoint,
      enqueueSnackbar,
      resourceLabel,
      handleRequestResourceError,
      setLoading,
    ]
  );

  // get single resource

  const getResource = useCallback(
    (id) => {
      setLoading(true);
      apiClient
        .get(`/api/${endpoint}/${id}`, getCommonOptions())
        .then((res) => {
          setLoading(false);
          const { data } = res;
          setResource(data);
        })
        .catch(handleRequestResourceError);
    },
    [endpoint, handleRequestResourceError, setLoading]
  );

  //Update resource

  const updateResource = useCallback(
    (id, values, successCallback) => {
      setLoading(true);
      apiClient
        .patch(`/api/${endpoint}/${id}/`, values, getCommonOptions())
        .then((res) => {
          const updated = res.data;
          const newResourceList = {
            results: resourceList.results.map((r) => {
              if (r.id === id) {
                return updated;
              }
              return r;
            }),
            count: resourceList.count,
          };
          setResourceList(newResourceList);
          setLoading(false);
          enqueueSnackbar(`${resourceLabel} updated`);
          if (successCallback) {
            successCallback();
          }
        })
        .catch(handleRequestResourceError);
    },
    [
      endpoint,
      enqueueSnackbar,
      resourceLabel,
      handleRequestResourceError,
      setLoading,
      resourceList,
    ]
  );

  //Delete resource
  const deleteResource = useCallback(
    (id) => {
      setLoading(true);
      apiClient
        .delete(`/api/${endpoint}/${id}/`, getCommonOptions())
        .then(() => {
          setLoading(false);
          enqueueSnackbar(`${resourceLabel} deleted`);
          const newResourceList = {
            results: resourceList.results.filter((r) => r.id !== id),
          };
          setResourceList(newResourceList);
        })
        .catch(handleRequestResourceError);
    },
    [
      endpoint,
      resourceList,
      enqueueSnackbar,
      resourceLabel,
      handleRequestResourceError,
      setLoading,
    ]
  );
  return {
    resourceList,
    getResourceList,
    addResource,
    resource,
    getResource,
    updateResource,
    deleteResource,
    error,
  };
}
