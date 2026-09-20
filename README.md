# Mobile Backend Performance Test

## What should be done

Goal
Capture and analyze backend requests from the Wikipedia mobile app using Charles Proxy, and create a test to simulate key user actions.

## Prerequisites
Pair your laptop with an Android emulator (Pixel XL, API 33, Google APIs) or iOS device/simulator.
Set up the Wikipedia app.

## Description
Configure the device/emulator to route traffic through Charles Proxy.
Verify that Charles Proxy is capturing requests from the Wikipedia app.
Create JMeter or Gatling test that implements the next user flow:
Search for “EPAM” in the Wikipedia app.
Open the page from the first search result.

## Expected Output
Screenshot showing Wikipedia requests captured in Charles Proxy. The screenshot must clearly display the session list, URL, and request body (no errors inside the request).
JMeter or Gatling script file.

## Running the Gatling test

Use a small load profile for Wikipedia public endpoints to avoid `429 Too Many Requests` responses:

```powershell
.\mvnw.cmd gatling:test "-Dgatling.simulationClass=simulations.PerfTestSimulation" -DOPEN_USERS=1 -DLOAD_MODEL=open
```

Higher user counts should be used only against a system where load testing is allowed.
