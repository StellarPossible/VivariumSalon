# SSH Authentication Guide for GitHub Actions

To fix the SSH authentication issues in the GitHub Actions workflow, you need to set up the following secrets in your GitHub repository:

## Required Secrets

1. **VPS_SERVER** - The hostname or IP address of your server
2. **VPS_USERNAME** - The SSH username for connecting to the server
3. **SSH_PRIVATE_KEY** - Your private SSH key (full key content including headers)
4. **SSH_HOST_KEY** - The SSH host key fingerprint of your server

## How to get the SSH Host Key

To obtain your server's SSH host key, run the following command from your local machine:

```bash
ssh-keyscan -t rsa YOUR_SERVER_IP_OR_HOSTNAME
```

Take the output of this command (excluding the IP/hostname part) and add it as the `SSH_HOST_KEY` secret.

## Troubleshooting

If you continue experiencing SSH issues:

1. Ensure your SSH key has the correct permissions on your local machine (`chmod 600 ~/.ssh/id_rsa`)
2. Verify that your SSH public key is added to the `~/.ssh/authorized_keys` file on the server
3. Check that your server user has permission to run Docker commands
4. Make sure the paths in the workflow match your actual server configuration

## Additional Notes

- The workflow now uses direct SSH commands instead of action plugins for improved control and debugging
- All escape sequences in quoted command strings are properly handled
- The SSH key is securely stored as a GitHub secret and set up with the correct permissions during the workflow run