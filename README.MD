# Getting Started with Configuring External Call flow Application

This is a Full-stack Web Application for 3CX Call Control API demonstration.

## Configuration steps from PBX Side

From the Admin Console in the 3CX Webclient, go to Integrations > API:

1.  Press the Add button to create a new client application.
2.  Specify the ClientID (DN for accessing the route point, which is also needed for authorization).
3.  If using the Call Control scope, check the Call Control Access Enabled checkbox.
4.  (Optional) Specify DID numbers for the Route Point.
5.  (Optional) Specify additional extensions you want to monitor using the API.
6.  After successfully creating a new API instance, you will receive an API key for your third-party applications. This key will be shown only once, so be sure to save it for future use.

- [x] **That's it! You've successfully completed the PBX configuration.**

> [!IMPORTANT]
> You must have a 3CX Enterprise license and CFD access to use 3CX Call Control.

## Installation and Configuration

### Prerequisites

Before running the application, ensure you have the following installed:

* [Node.js](https://nodejs.org/en) (LTS version recommended)

* [Yarn (package manager)](https://yarnpkg.com/) – If not installed, run:

```bash
npm install -g yarn
```

### Installation Steps

Follow these steps to install and set up the application:

1. **Download the Repository:**
    You can get the project files in one of the following ways:

    * **Using Git:** Open a terminal and run the following command to clone the repository:
    ```bash
    git clone https://github.com/3cx/call-control-examples.git
    ```
    
    * **Without Git:**
        * Click the **Code** button on top of the repository and select Download ZIP.
        * Extract the downloaded ZIP file to a directory of your choice.

2. **Navigate to the Project Directory:**

    ```bash
    cd call-control-examples
    ```

3. **Install dependencies:**

    Use Yarn to install the necessary packages for the project:

    ```bash
    yarn install
    ```

4. **Understand the Project Structure:**

    The project contains the following folders:

    * `server`: The main backend server.
    * `client`: Example User Interface showcasing the integration.
    * `calling-integration-sdk-demo-react-ts`: A HubSpot integration example widget (React + TypeScript).
    * `cc-component-lib`: A library of shared components used across the examples.

- [x] **Done!** After you installed dependencies, you can proceed with running the Application.

## Starting the Application

To run the application, execute the following command in your terminal:

```bash
yarn start
```

### What Happens Next?

The `yarn start` command will:

1. Start the client-side interface at:

    ```arduino
    https://localhost:8081
    ```
    **Open this URL manually in your browser to access the client interface.**

2. Concurrently run the Application Server at:

    ```arduino
    http://localhost:8080
    ```

> [!NOTE]
> ⚙️ Both the Development Server (client-side) and Backend Server base paths are configurable via their respective `.env` files.

## Working with Examples

Once you've opened the UI in your browser, you'll see a list of available examples. Follow these steps to connect your application to the PBX and start working with the selected example:

1. **Select an Example:** 
    Choose the example you want to explore from the list
2. **Fill in the Connection Form:**
    Provide the required details to establish a connection:
    * **PBX Base URL:** The URL of your PBX instance (eg. `https://pbxuser.3cx.com`)
    * **APP ID:** The Client ID of the [Service Principal](#configuration-steps-from-pbx-side), configured on the PBX Side.
    * **APP Secret:** the secret key generated when you created the [Service Principal](#configuration-steps-from-pbx-side)
3. **Connect to the PBX:**
    Click **Connect** to establish the connection.   
4. **Interact with the Example:**
    Once connected, you can begin working with the selected example and explore its functionality.

 Below, you can read about each example in detail to understand its purpose and functionality.

## Examples Description

The basic example demonstrates three different approaches to using the PBX Call Control API. All these examples are built around the 3CX Call Control Web API, showcasing its versatility and capabilities.

For more details, please refer to the **[API Endpoint Documentation](https://www.3cx.com/docs/call-control-api-endpoints/)**, which provides a comprehensive overview of available endpoints and their functionality.

For now there are three following examples:

1. **Custom IVR Implementation**:
    This application implements IVR (Interactive Voice Response) functionality. Key features include:

    * Prompt Streaming: Stream a prompt file to participants handled by the IVR connection.
    * DTMF Routing: Specify DTMF string routes for redirection purposes.
    * Outbound Calls: Perform outgoing calls by specifying a comma-separated list of phone numbers to initiate a dialing campaign.

2. **Outbound Campaign Implementation:**
    This application represents a simple Outbound Campaign:

    * Allows you to specify comma-separated phone numbers and initiate a dialing campaign.
    * Ideal for managing batch calls efficiently.

3. **Dialer Implementation:**
    The Dialer application acts as a virtual phone connected to your PBX Extension, offering several call management capabilities:

    * Device Selection: Choose from the devices available for your PBX Extension to handle calls.
    * Make and Receive Calls: Easily initiate or answer calls directly from the application.
    * Call Operations:
        * Transfer Calls: Redirect an active call to another destination.
        * Divert Calls: Forward incoming calls to another number or device.
    
    This application provides a streamlined experience for managing calls as if using a physical phone device, all while being integrated with your PBX system.

## HubSpot Integration Example

HubSpot Calling SDK Integration provides live example in development local environment

> [!IMPORTANT]
> This is not real live ready to deploy HubSpot Application

### Running HubSpot example

Run following command from terminal:

```bash
yarn start-hubspot
```

> [!NOTE]
> the `yarn start` command will launch development server at https://localhost:9025/, you need manually enter the URL in your browser, then may need to bypass a "Your connection is not secure" warning in order to access the application.

- [x] **Done!** If you are succeeded, your browser will be opened automatically.

### Configuration steps from HubSpot side

First, look at provided by HubSpot guide [Calling Extensions SDK](https://developers.hubspot.com/docs/api/crm/extensions/calling-sdk).

1. Create HubSpot [App Developer account](https://app.hubspot.com/signup/developers)
2. Within your App Developer account create [Developer test account](https://developers.hubspot.com/docs/api/account-types#developer-test-accounts)
3. Within Developer Test Account, navigate to your records:

<ul>
    <li> Contacts: In your HubSpot account, navigate to Contacts > Contacts.</li>
    <li> Company: In your HubSpot account, navigate to Contacts > Companies.</li>
</ul>

4. Open your browser's developer console, and run the following command:
   `localStorage.setItem("LocalSettings:Calling:installDemoWidget", "local");`

5. Make sure you have run a [HubSpot example](#running)
