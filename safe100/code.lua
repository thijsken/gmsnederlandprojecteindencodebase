local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerStorage = game:GetService("ServerStorage")
local StarterGui = game:GetService("StarterGui")
local StarterPlayerScripts = game:GetService("StarterPlayer").StarterPlayerScripts
local ServerScriptService = game:GetService("ServerScriptService")
local Workspace = game:GetService("Workspace")
local SecurityEvent = ReplicatedStorage:WaitForChild("SecurityBreachEvent")
local TRELLO_API_KEY = "c8b549654645f01a3b76ebbab7b76195"
local TRELLO_TOKEN = "ATTA6f98527b20b3ac401db70aa059ef80996f7a78c3b53854b5f06db098b27a072168F07732"
local TRELLO_BOARD_ID = "vBcL9Trd"
local TRELLO_LIST_NAME = "Gekocht"
local DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1395070251506335784/PqRjPpp_rQ6b3QYGg4CpjuS4OVDhurQKMwz-6-WXgumf1UabstWQK_uhEycytwLpX9Dx"
local whitelistCache = nil
local whitelistCacheTimestamp = 0
local WHITELIST_CACHE_DURATION = 300
local joinAttempts = {}
local ownerNameCache = nil
local ownerIdCache = nil
local function debugPrint(...)
end

local function canUseHttp()
	local success, result = pcall(function()
		return HttpService.HttpEnabled
	end)
	return success and result
end

local function waitForHttpEnabled(timeout)
	timeout = timeout or 10
	local startTime = os.clock()
	while not canUseHttp() do
		if os.clock() - startTime > timeout then
			return false
		end
		task.wait(0.5)
	end
	return true
end

local function getGameOwnerInfo()
	if ownerNameCache and ownerIdCache then
		return ownerNameCache, ownerIdCache
	end

	ownerIdCache = game.CreatorId or 0
	ownerNameCache = "Onbekend"

	if ownerIdCache ~= 0 then
		local success, result = pcall(function()
			return Players:GetNameFromUserIdAsync(ownerIdCache)
		end)
		if success and result then
			ownerNameCache = result
		end
	end

	return ownerNameCache, ownerIdCache
end

local function fetchWhitelist()
	if not canUseHttp() then
		warn("HTTP is uitgeschakeld.")
		return nil
	end

	local url = string.format("https://api.trello.com/1/boards/%s/lists?key=%s&token=%s", TRELLO_BOARD_ID, TRELLO_API_KEY, TRELLO_TOKEN)
	local success, lists = pcall(function()
		return HttpService:JSONDecode(HttpService:GetAsync(url))
	end)

	if not success or type(lists) ~= "table" then
		warn("Fout bij ophalen Trello lijsten.")
		return nil
	end

	for _, list in ipairs(lists) do
		if list.name:lower() == TRELLO_LIST_NAME:lower() then
			local cardUrl = string.format("https://api.trello.com/1/lists/%s/cards?key=%s&token=%s", list.id, TRELLO_API_KEY, TRELLO_TOKEN)
			local cardsSuccess, cards = pcall(function()
				return HttpService:JSONDecode(HttpService:GetAsync(cardUrl))
			end)
			if not cardsSuccess or type(cards) ~= "table" then
				warn("Fout bij ophalen Trello kaarten.")
				return nil
			end

			local whitelist = {}
			debugPrint("Whitelist items opgehaald van Trello:")
			for _, card in ipairs(cards) do
				local name, userId = card.name:lower():match("([^:]+):?(%d*)")
				if name then
					whitelist[name] = true
					if userId ~= "" then
						whitelist[userId] = true
					end
					debugPrint(" - " .. name .. " (UserId: " .. (userId ~= "" and userId or "n.v.t.") .. ")")
				end
			end
			return whitelist
		end
	end

	warn("Lijst '" .. TRELLO_LIST_NAME .. "' niet gevonden op Trello.")
	return nil
end

local function updateWhitelistCache()
	if os.time() - whitelistCacheTimestamp > WHITELIST_CACHE_DURATION or not whitelistCache then
		whitelistCache = fetchWhitelist()
		whitelistCacheTimestamp = os.time()
	end
end

local function isPlayerWhitelisted(player)
	updateWhitelistCache()

	if not whitelistCache then
		debugPrint("Whitelist niet beschikbaar, standaard weigeren.")
		return false
	end

	local playerName = player.Name:lower()
	local playerUserId = tostring(player.UserId)

	debugPrint("Check whitelist voor:", playerName, playerUserId)
	debugPrint("Whitelist bevat naam?", whitelistCache[playerName])
	debugPrint("Whitelist bevat userId?", whitelistCache[playerUserId])

	return whitelistCache[playerName] == true or whitelistCache[playerUserId] == true
end

local function sendDiscordWebhook(player, attempts)
	if not canUseHttp() then return end

	local gameLink = "https://www.roblox.com/games/" .. game.PlaceId
	local ownerName, ownerId = getGameOwnerInfo()

	local payload = {
		username = "Whitelist Bot",
		embeds = {{
			title = "🚫 Ongeautoriseerde toegang!",
			description = ("**%s** (Id: %d) join attempt #%d"):format(player.Name, player.UserId, attempts),
			color = 16711680,
			fields = {
				{ name = "Roblox Naam", value = player.Name, inline = true },
				{ name = "Poging",       value = tostring(attempts), inline = true },
				{ name = "Game",         value = "[Open Game]("..gameLink..")", inline = false },
				{ name = "Owner",        value = ownerName, inline = false },
			},
			thumbnail = { url = "https://www.roblox.com/headshot-thumbnail/image?userId="..player.UserId.."&width=150&height=150&format=png" },
			timestamp = os.date("!%Y-%m-%dT%H:%M:%SZ")
		}}
	}

	HttpService:PostAsync(DISCORD_WEBHOOK_URL, HttpService:JSONEncode(payload), Enum.HttpContentType.ApplicationJson)
end

local function sendDiscordWebhookleaker(reason, triggeringPlayer)
	if not canUseHttp() then
		warn("[SECURITY] HTTP Requests niet toegestaan.")
		return
	end

	local gameLink = "https://www.roblox.com/games/" .. game.PlaceId
	local ownerName, ownerId = getGameOwnerInfo()

	local thumbnailUrl = ""
	local playerName = "Onbekend"
	local playerId = 0

	if triggeringPlayer then
		playerName = triggeringPlayer.Name
		playerId = triggeringPlayer.UserId
		thumbnailUrl = "https://www.roblox.com/headshot-thumbnail/image?userId="..playerId.."&width=150&height=150&format=png"
	end

	local payload = {
		username = "🔒 Security Bot",
		embeds = {{
			title = "🚨 Beveiligingsincident Gedetecteerd",
			description = "**Systeemvergrendeling geactiveerd.**",
			color = 16711680,
			fields = {
				{ name = "Reden", value = reason, inline = false },
				{ name = "Speler (indien van toepassing)", value = ("%s (ID: %d)"):format(playerName, playerId), inline = false },
				{ name = "Aantal spelers", value = tostring(#Players:GetPlayers()), inline = true },
				{ name = "ServerID", value = game.JobId, inline = true },
				{ name = "Game", value = "[Klik om te openen]("..gameLink..")", inline = false },
				{ name = "Eigenaar", value = ("%s (ID: %d)"):format(ownerName, ownerId), inline = false }
			},
			thumbnail = { url = thumbnailUrl },
			timestamp = os.date("!%Y-%m-%dT%H:%M:%SZ")
		}}
	}

	local success, response = pcall(function()
		HttpService:PostAsync(DISCORD_WEBHOOK_URL, HttpService:JSONEncode(payload), Enum.HttpContentType.ApplicationJson)
	end)

	if success then
		warn("[SECURITY] Discord-melding verzonden.")
	else
		warn("[SECURITY] Fout bij verzenden Discord-melding:", response)
	end
end

local function wipeGameContent()
	debugPrint("Verwijderen van game content gestart.")

	local function wipe(container)
		for _, item in pairs(container:GetChildren()) do
			if not item:IsA("Terrain") then
				item:Destroy()
			end
		end
	end

	wipe(Workspace)
	wipe(ReplicatedStorage)
	wipe(ServerStorage)
	wipe(StarterGui)
	wipe(StarterPlayerScripts)
	wipe(ServerScriptService)

	for _, player in pairs(Players:GetPlayers()) do
		local gui = player:FindFirstChild("PlayerGui")
		if gui then
			for _, child in pairs(gui:GetChildren()) do
				child:Destroy()
			end
		end
	end
end

local function anchorAllPlayers()
	for _, player in pairs(Players:GetPlayers()) do
		local char = player.Character or player.CharacterAdded:Wait()
		local hrp = char:WaitForChild("HumanoidRootPart", 5)
		if hrp then
			hrp.Anchored = true
		end
	end
end

local function notifyAllPlayersBeforeWipe()
	for _, player in pairs(Players:GetPlayers()) do
		joinAttempts[player.UserId] = (joinAttempts[player.UserId] or 0) + 1
		sendDiscordWebhook(player, joinAttempts[player.UserId])
	end
end

local function kickAllPlayers()
	for _, player in pairs(Players:GetPlayers()) do
		player:Kick("Je staat niet op de whitelist.")
	end
end

if not waitForHttpEnabled(10) then
	warn("HTTP niet beschikbaar na wachten, game gaat wipe & kick.")
	anchorAllPlayers()
	notifyAllPlayersBeforeWipe()
	wipeGameContent()
	kickAllPlayers()
	return
end

local CHECK_INTERVAL = 4
local function periodicWhitelistCheck()
	while true do
		if not canUseHttp() then
			warn("HTTP uitgeschakeld tijdens runtime. Start wipe en kick.")
			anchorAllPlayers()
			notifyAllPlayersBeforeWipe()
			wipeGameContent()
			kickAllPlayers()
			return
		end

		for _, player in pairs(Players:GetPlayers()) do
			if not isPlayerWhitelisted(player) then
				debugPrint("Speler " .. player.Name .. " is niet gewhitelisted, wipe start.")
				anchorAllPlayers()
				notifyAllPlayersBeforeWipe()
				wipeGameContent()
				kickAllPlayers()
				return
			end
		end

		task.wait(CHECK_INTERVAL)
	end
end

Players.PlayerAdded:Connect(function(player)
	debugPrint("Speler toegevoegd:", player.Name)

	if not canUseHttp() then
		debugPrint("HTTP is uitgeschakeld bij speler join. Direct kick.")
		player:Kick("HTTP is uitgeschakeld. Toegang geweigerd.")
		return
	end

	if not isPlayerWhitelisted(player) then
		joinAttempts[player.UserId] = (joinAttempts[player.UserId] or 0) + 1
		sendDiscordWebhook(player, joinAttempts[player.UserId])
		player.CharacterAdded:Connect(function(char)
			local hrp = char:WaitForChild("HumanoidRootPart", 5)
			if hrp then
				hrp.Anchored = true
			end
		end)
		task.delay(1, function()
			if player and player.Parent then
				player:Kick("Je staat niet op de whitelist.")
			end
		end)
	end
end)

task.spawn(periodicWhitelistCheck)

local securityQueue = {}

SecurityEvent.Event:Connect(function(reason)
	table.insert(securityQueue, reason or "Onbekend")
	warn("[SECURITY] 🚨 Beveiligingsmelding ontvangen: " .. tostring(reason))
end)

task.spawn(function()
	while true do
		task.wait(0.1) 

		if #securityQueue > 0 then
			local reason = table.remove(securityQueue, 1)
			warn("[SECURITY] ⚠️ Beveiligingsactie gestart. Reden: " .. tostring(reason))

			pcall(function()
				sendDiscordWebhookleaker(reason, nil)
				print("[SECURITY] Discord-melding verzonden.")
			end)

			pcall(notifyAllPlayersBeforeWipe)
			pcall(anchorAllPlayers)
			pcall(wipeGameContent)
			pcall(kickAllPlayers)

			warn("[SECURITY] ✅ Alle spelers verwijderd. Systeem blijft actief voor verdere monitoring.")
		end
	end
end)



debugPrint("Whitelist script gestart en actief.")
