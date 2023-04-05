import React, { useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import classes from '../../../../styles/alertDialog.module.scss';
import { toast } from 'react-toastify';
import { getCookie } from '@utils/common/storage/cookie/document';
import axios from 'axios';

const AlertDialogComponent = (props) => {

  let accessToken = getCookie('user-access-token')
  accessToken = JSON.parse(accessToken).accessToken
  const deleteFunction = async () => {

    if (props.handle) {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/remove-DTK-product-${props.api}?id=${props.id}&handle=${props.handle}`, {
          headers: {
            'Authorization': accessToken
          }
        })

        if (response.data) {
          toast.success(response.data.message)
          window.location.reload()
          return
        }
      } catch (error) {
        if (error.response) {
          if (!error.response.data.success) {
            return toast.warn(error.response.data.message)
          }
        }
      }

    }

    if (props.action === 'review') {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/remove-review?id=${props.id}&page=${props.page}`, {
          headers: {
            'Authorization': accessToken
          }
        })
        if (response.data) {
          toast.success(response.data.message)
          window.location.reload()
          return
        }
      } catch (error) {
        if (error.response) {
          if (!error.response.data.success) {
            return toast.warn(error.response.data.message)
          }
        }
      }
    }


    if (props.action === 'artist') {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/remove-artist?id=${props.id}&page=${props.page}`, {
          headers: {
            'Authorization': accessToken
          }
        })
        if (response.data) {
          toast.success(response.data.message)
          window.location.reload()
          return
        }
      } catch (error) {
        if (error.response) {
          if (!error.response.data.success) {
            return toast.warn(error.response.data.message)
          }
        }
      }
    }


    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/admin/${props.adminId}`, {
        headers: {
          'Authorization': accessToken
        }
      })
      if (response.data) {
        props.setAdmins(response.data.admins)
        toast.success(response.data.message)
        window.location.reload()
        return
      }
    } catch (error) {
      if (error.response) {
        if (!error.response.data.success) {
          return toast.warn(error.response.data.message)
        }
      }
    }
  }

  return (

    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        {props.children}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={classes.AlertDialogOverlay} />
        <AlertDialog.Content className={classes.AlertDialogContent}>
          <AlertDialog.Title className={classes.AlertDialogTitle}>Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description className={classes.AlertDialogDescription}>
            This action cannot be undone. {props.handle || props.action ? '' : 'This will permanently delete the account and'} remove
            data from our servers.
          </AlertDialog.Description>
          <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
            <AlertDialog.Cancel asChild>
              <button className={classes.Button + ' ' + classes.mauve}>Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action onClick={deleteFunction} asChild>
              <button className={classes.Button + ' ' + classes.red}>Yes, delete {props.handle || props.action ? '' : 'account'}</button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export default AlertDialogComponent;